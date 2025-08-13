package com.br.ggastosservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.br.ggastosservice.dto.MonthlyTotalDto;
import com.br.ggastosservice.dto.TesteDto;
import com.br.ggastosservice.dto.TransactionUploadDto;
import com.br.ggastosservice.model.Account;
import com.br.ggastosservice.model.Category;
import com.br.ggastosservice.model.CreditCard;
import com.br.ggastosservice.model.FileAttachment;
import com.br.ggastosservice.model.FixedTransaction;
import com.br.ggastosservice.model.RecurrenceType;
import com.br.ggastosservice.model.SubCategory;
import com.br.ggastosservice.model.Transaction;
import com.br.ggastosservice.model.TransactionType;
import com.br.ggastosservice.repository.TransactionRepository;

@Service
public class TransactionService {

    private TransactionRepository transactionRepository;

    private SubCategoryService subCategoryService;

    private CategoryService categoryService;

    private AccountService accountService;

    private CreditCardService creditCardService;

    private TransactionTypeService transactionTypeService;

    private FixedTransactionService fixedTransactionService;

    private FileAttachmentService fileAttachmentService;

    public TransactionService(TransactionRepository transactionRepository,
            SubCategoryService subCategoryService, CategoryService categoryService,
            AccountService accountService, CreditCardService creditCardService,
            TransactionTypeService transactionTypeService, FixedTransactionService fixedTransactionService,
            FileAttachmentService fileAttachmentService) {
        this.transactionRepository = transactionRepository;
        this.subCategoryService = subCategoryService;
        this.categoryService = categoryService;
        this.accountService = accountService;
        this.creditCardService = creditCardService;
        this.transactionTypeService = transactionTypeService;
        this.fixedTransactionService = fixedTransactionService;
        this.fileAttachmentService = fileAttachmentService;
    }

    public Transaction findOne(long id) throws Exception  {
        Optional<Transaction> transaction = transactionRepository.findById(id);
        if (transaction == null || !transaction.isPresent()) {
            throw new Exception("Transaction type ID: " +id+ ", não encontrado!");
        }
        return transaction.get();
    }

    public List<Transaction> findAll() {
        return transactionRepository.findByPaidDateNotNullOrderByCategoryIdAscSubCategoryAscPaidDateAsc();
    }

    public List<Transaction> findPaidTransactionsInPeriod() {
        LocalDateTime start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);
        return transactionRepository.findPaidTransactionsInPeriod(start, end);
    }

    public List<Transaction> findByTransactionTypeId(long transactionTypeId) {
        LocalDateTime start = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime end = start.plusMonths(1).minusNanos(1);
        return transactionRepository.findByTransactionTypeIdAndPaidDateNotNullAndTransactionDateBetweenOrderByCategoryIdAscSubCategoryCategoryIdAsc(transactionTypeId, start, end);
    }

    public List<Transaction> findExpiredUnpaid(long transactionId) {
        return transactionRepository.findByTransactionTypeId(transactionId);
    }

    public List<Transaction> findByDate(LocalDateTime date, long categoryId) {
        LocalDateTime fim = date
            .with(TemporalAdjusters.lastDayOfMonth())
            .with(LocalTime.MAX);

        return transactionRepository.searchTransactionsByCategoryAndDate(categoryId, date, fim);
    }

    public List<Transaction> findByDate(String date) {
        int ano = Integer.parseInt(date.split("-")[0]);
        int mes = Integer.parseInt(date.split("-")[1]);

        LocalDateTime inicio = LocalDateTime.of(ano, mes, 1, 0, 0);

        LocalDateTime fim = inicio
            .with(TemporalAdjusters.lastDayOfMonth())
            .with(LocalTime.MAX);

        List<Transaction> list = transactionRepository.findAllByTransactionDateBetweenOrderByTransactionDate(inicio, fim);

        List<Transaction> generatedTransactions = new ArrayList<>();

        Set<String> transacoesPagas = list.stream()
            .filter(t -> t.getFixedTransactionId() != null && t.getTransactionDate() != null)
            .map(t -> t.getFixedTransactionId() + "|" + t.getTransactionDate().toLocalDate())
            .collect(Collectors.toSet());

        List<FixedTransaction> fixedTransactionList = fixedTransactionService.findAll();
        for (FixedTransaction fixed : fixedTransactionList) {
            LocalDateTime transactionStart = fixed.getTransactionDate();

            ChronoUnit unit = ChronoUnit.MONTHS;
            int step = 0;
            RecurrenceType type = fixed.getRecurrenceType();
            if (type.getDay() != 0) {
                unit = ChronoUnit.DAYS;
                step = type.getDay();

            } else if (type.getMonth() != 0) {
                unit = ChronoUnit.MONTHS;
                step = type.getMonth();

            } else if (type.getYear() != 0) {
                unit = ChronoUnit.YEARS;
                step = type.getYear();
            }

            LocalDateTime current = transactionStart;
            while (!current.isAfter(fim)) {
                if (!current.isBefore(inicio)) {

                    String chave = fixed.getId() + "|" + current.toLocalDate();
                    if (!transacoesPagas.contains(chave)) {
                        Transaction simulated = new Transaction();
                        simulated.setFixedTransactionId(fixed.getId());
                        simulated.setValue(fixed.getValue());
                        simulated.setTransactionType(fixed.getTransactionType());
                        simulated.setTransactionDate(current);
                        simulated.setAccount(fixed.getAccount());
                        simulated.setCategory(fixed.getCategory());
                        simulated.setSubCategory(fixed.getSubCategory());
                        simulated.setCreditCard(fixed.getCreditCard());
                        simulated.setDescription(fixed.getDescription());

                        generatedTransactions.add(simulated);
                        list.add(simulated);
                    }
                }

                current = current.plus(step, unit);
            }
        }

        list.sort(Comparator.comparing(Transaction::getTransactionDate));

        return list;
    }

    public void create(Transaction transaction, MultipartFile multipartFile) throws Exception {
        verifyTransaction(transaction);

        FileAttachment file = fileAttachmentService.verifyAndSaveFile(multipartFile);
        if (file != null) {
            transaction.setSelectedFile(file);
        }

        if (transaction.getFixedTransactionId() != null) {
            transaction.setPaidDate(LocalDateTime.now());
        }

        transactionRepository.save(transaction);

        accountService.updateBalance(transaction.getAccount().getId());
    }

    public void update(Transaction transaction, long transactionId) throws Exception {
        findOne(transactionId);
        verifyTransaction(transaction);

        transaction.setId(transactionId);

        if (transaction.getSelectedFile() == null) {
            fileAttachmentService.deleteFile(transactionId);
        }

        if (transaction.getFixedTransactionId() != null) {
            transaction.setPaidDate(LocalDateTime.now());
        }

        transactionRepository.save(transaction);

        accountService.updateBalance(transaction.getAccount().getId());
    }

    public void updateCurrentOthers(Transaction transaction, long transactionId, long fixedId) throws Exception {
        fixedTransactionService.updateByTransaction(transaction, fixedId);

        verifyTransaction(transaction);
        if (transactionId == 0) {
            transaction.setFixedTransactionId(fixedId);
            create(transaction, null);
        } else {
            update(transaction, transactionId);
        }
    }

    public void updateAllItens(Transaction transaction, long transactionId, long fixedId) throws Exception {
        fixedTransactionService.updateByTransaction(transaction, fixedId);

        verifyTransaction(transaction);

        List<Transaction> transactions = transactionRepository.findByFixedTransactionId(fixedId);
        List<Transaction> newTransactions = new ArrayList<Transaction>();
        for (Transaction item : transactions) {
            Transaction newTransaction = transaction.copy();
            newTransaction.setId(item.getId());
            newTransaction.setFixedTransactionId(fixedId);
            newTransaction.setTransactionDate(item.getTransactionDate());
            newTransaction.setPaidDate(item.getPaidDate());
            newTransactions.add(newTransaction);
        }
        transactionRepository.saveAll(newTransactions);

        if (transactionId == 0) {
            transaction.setFixedTransactionId(fixedId);
            create(transaction, null);
        }
    }

    public void delete(long transactionId) throws Exception {
        Transaction transaction = findOne(transactionId);
        fileAttachmentService.deleteFile(transactionId);
        transactionRepository.delete(transaction);

        accountService.updateBalance(transaction.getAccount().getId());
    }

    public void deleteCurrentOthers(long transactionId, long fixedId) {
        try {
            delete(transactionId);
            fixedTransactionService.delete(fixedId);
        } catch (Exception e) {
            System.out.println("Tem que codar");
        }
    }

    public void deleteAllItens(long transactionId, long fixedId) throws Exception {
        List<Transaction> transactions = transactionRepository.findByFixedTransactionId(fixedId);
        transactionRepository.deleteAll(transactions);
        delete(transactionId);
    }

    private void verifyTransaction(Transaction transaction) throws Exception {
        TransactionType transactionType = transactionTypeService.findOne(transaction.getTransactionType().getId());
        transaction.setTransactionType(transactionType);

        if (transaction.getSubCategory() != null && transaction.getSubCategory().getId() != 0) {
            SubCategory subCategory = subCategoryService.findOne(transaction.getSubCategory().getId());
            transaction.setSubCategory(subCategory);
        } else {
            transaction.setSubCategory(null);
        }
        if (transaction.getCategory() != null && transaction.getCategory().getId() != 0) {
            Category category = categoryService.findOne(transaction.getCategory().getId());
            transaction.setCategory(category);
        } else {
            transaction.setCategory(null);
        }
        if (transaction.getAccount() != null && transaction.getAccount().getId() != 0) {
            Account account = accountService.findOne(transaction.getAccount().getId());
            transaction.setAccount(account);
        } else {
            transaction.setAccount(null);
        }
        if (transaction.getCreditCard() != null && transaction.getCreditCard().getId() != 0) {
            CreditCard creditCard = creditCardService.findOne(transaction.getCreditCard().getId());
            transaction.setCreditCard(creditCard);
        } else {
            transaction.setCreditCard(null);
        }
    }

    public void paidTransaction(long transactionId) throws Exception {
        Transaction transaction = findOne(transactionId);
        if (transaction.getPaidDate() == null) {
            transaction.setPaidDate(LocalDateTime.now());
        } else {
            transaction.setPaidDate(null);
        }
        transactionRepository.save(transaction);

        accountService.updateBalance(transaction.getAccount().getId());
    }


    public void teste(TesteDto transactions) throws Exception {
        Category category = categoryService.findOne(transactions.getCategoryId());
        Account account = accountService.findOne(transactions.getAccountId());
        TransactionType transactionType = transactionTypeService.findOne(1);


        List<Transaction> transactionsList = new ArrayList<Transaction>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        for (TransactionUploadDto item : transactions.getTransactions()) {
            LocalDate date = LocalDate.parse(item.getDate(), formatter);
            LocalDateTime dateTime = date.atStartOfDay();

            Transaction transaction = new Transaction();
            transaction.setAccount(account);
            transaction.setCategory(category);
            transaction.setTransactionType(transactionType);
            transaction.setValue(item.getAmount());
            transaction.setPaidDate(dateTime);
            transaction.setTransactionDate(dateTime);
            transaction.setDescription(item.getDescription());

            transactionsList.add(transaction);
        }

        transactionRepository.saveAll(transactionsList);
    }

    public List<MonthlyTotalDto> findMonthlyTotalsByYear(int year) {
        List<MonthlyTotalDto> result = transactionRepository.findMonthlyTotalsByYear(year);
        return result;
    }

}
