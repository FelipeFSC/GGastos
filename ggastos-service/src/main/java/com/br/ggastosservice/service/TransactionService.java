package com.br.ggastosservice.service;

import java.math.BigDecimal;
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

    private RecurrenceTypeService recurrenceTypeService;

    public TransactionService(TransactionRepository transactionRepository,
            SubCategoryService subCategoryService, CategoryService categoryService,
            AccountService accountService, CreditCardService creditCardService,
            TransactionTypeService transactionTypeService, FixedTransactionService fixedTransactionService,
            FileAttachmentService fileAttachmentService,
            RecurrenceTypeService recurrenceTypeService) {
        this.transactionRepository = transactionRepository;
        this.subCategoryService = subCategoryService;
        this.categoryService = categoryService;
        this.accountService = accountService;
        this.creditCardService = creditCardService;
        this.transactionTypeService = transactionTypeService;
        this.fixedTransactionService = fixedTransactionService;
        this.fileAttachmentService = fileAttachmentService;
        this.recurrenceTypeService = recurrenceTypeService;
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

    public List<Transaction> findByDate(String date, String paymentMethod) {
        int ano = Integer.parseInt(date.split("-")[0]);
        int mes = Integer.parseInt(date.split("-")[1]);

        LocalDateTime inicio = LocalDateTime.of(ano, mes, 1, 0, 0);

        LocalDateTime fim = inicio
            .with(TemporalAdjusters.lastDayOfMonth())
            .with(LocalTime.MAX);

        List<Transaction> list;
        if ("card".equalsIgnoreCase(paymentMethod)) {
            list = transactionRepository.findAllByTransactionDateBetweenAndCreditCardIdIsNotNullOrderByTransactionDate(inicio, fim);
        } else if ("account".equalsIgnoreCase(paymentMethod)) {
            list = transactionRepository.findAllByTransactionDateBetweenAndCreditCardIdIsNullOrderByTransactionDate(inicio, fim);
        } else {
            list = transactionRepository.findAllByTransactionDateBetweenOrderByTransactionDate(inicio, fim);
        }

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

        // if we are creating a parcelado (installment) transaction, break it into multiple records
        if (transaction.getInstallmentTotal() != null && transaction.getInstallmentTotal() > 1) {
            int total = transaction.getInstallmentTotal();

            // look up the full recurrence type so we know how to increment dates
            RecurrenceType freq = null;
            if (transaction.getRecurrenceType() != null && transaction.getRecurrenceType().getId() != null) {
                freq = recurrenceTypeService.findOne(transaction.getRecurrenceType().getId());
            }

            // divide the total value by the number of installments
            BigDecimal totalValue = transaction.getValue();
            BigDecimal valuePerInstallment = totalValue.divide(new BigDecimal(total), 2, java.math.RoundingMode.DOWN);
            BigDecimal remainder = totalValue.subtract(valuePerInstallment.multiply(new BigDecimal(total)));

            // first record: save and use its generated id as group id
            transaction.setPaidDate(null); // installments are created unpaid initially
            // add remainder to first installment to ensure total matches
            transaction.setValue(valuePerInstallment.add(remainder));
            Transaction first = transactionRepository.save(transaction);
            Long groupId = first.getId();
            // mark as part of a parcel group for UI and logic
            first.setInstallmentGroupId(groupId);
            first.setInstallmentNumber(1);
            first.setInstallmentTotal(total);
            transactionRepository.save(first);

            // create the remaining installments by copying the first
            List<Transaction> others = new ArrayList<>();
            LocalDateTime currentDate = first.getTransactionDate();
            for (int i = 2; i <= total; i++) {
                Transaction t = first.copy();
                t.setId(null);
                // file attachment only on first installment
                t.setSelectedFile(null);
                t.setInstallmentGroupId(groupId);
                t.setInstallmentNumber(i);
                t.setPaidDate(null);
                // use divided value for remaining installments
                t.setValue(valuePerInstallment);

                // advance the date according to the chosen recurrence type (default to monthly if none)
                currentDate = incrementDate(currentDate, freq);
                t.setTransactionDate(currentDate);

                others.add(t);
            }
            if (!others.isEmpty()) {
                transactionRepository.saveAll(others);
            }

            if (transaction.getAccount() != null) {
                accountService.updateBalance(transaction.getAccount().getId());
            }
            if (transaction.getCreditCard() != null) {
                creditCardService.updateBalance(transaction.getCreditCard().getId());
            }
            return;
        }

        // mark paid only when the id refers to an actual fixed transaction
        if (transaction.getFixedTransactionId() != null
                && fixedTransactionService.exists(transaction.getFixedTransactionId())) {
            transaction.setPaidDate(LocalDateTime.now());
        }

        transactionRepository.save(transaction);

        if (transaction.getAccount() != null) {
            accountService.updateBalance(transaction.getAccount().getId());
        }
        if (transaction.getCreditCard() != null) {
            creditCardService.updateBalance(transaction.getCreditCard().getId());
        }
    }

    // helper used when splitting installment dates
    private LocalDateTime incrementDate(LocalDateTime date, RecurrenceType type) {
        if (type == null) {
            return date.plusMonths(1);
        }
        if (type.getDay() != 0) {
            return date.plusDays(type.getDay());
        } else if (type.getMonth() != 0) {
            return date.plusMonths(type.getMonth());
        } else if (type.getYear() != 0) {
            return date.plusYears(type.getYear());
        }
        return date;
    }

    public void update(Transaction transaction, long transactionId) throws Exception {
        Transaction existing = findOne(transactionId);
        verifyTransaction(transaction);

        transaction.setId(transactionId);

        if (transaction.getSelectedFile() == null) {
            fileAttachmentService.deleteFile(transactionId);
        }

        if (transaction.getFixedTransactionId() != null
                && fixedTransactionService.exists(transaction.getFixedTransactionId())) {
            transaction.setPaidDate(LocalDateTime.now());
        }

        // Check if this is an installment - if so, update all installments in the group
        if (existing.getInstallmentGroupId() != null) {
            Long groupId = existing.getInstallmentGroupId();
            List<Transaction> installments = transactionRepository.findByInstallmentGroupId(groupId);
            int total = installments.size();
            
            // Divide the total value by the number of installments
            BigDecimal totalValue = transaction.getValue();
            BigDecimal valuePerInstallment = totalValue.divide(new BigDecimal(total), 2, java.math.RoundingMode.DOWN);
            BigDecimal remainder = totalValue.subtract(valuePerInstallment.multiply(new BigDecimal(total)));
            
            for (int i = 0; i < installments.size(); i++) {
                Transaction installment = installments.get(i);
                Transaction updated = transaction.copy();
                updated.setId(installment.getId());
                updated.setInstallmentGroupId(groupId);
                updated.setInstallmentNumber(installment.getInstallmentNumber());
                updated.setInstallmentTotal(installment.getInstallmentTotal());
                updated.setTransactionDate(installment.getTransactionDate());
                updated.setPaidDate(installment.getPaidDate());
                
                // First installment gets the remainder
                if (i == 0) {
                    updated.setValue(valuePerInstallment.add(remainder));
                } else {
                    updated.setValue(valuePerInstallment);
                }
                
                transactionRepository.save(updated);
            }
        } else {
            // Regular transaction - update only this one
            transactionRepository.save(transaction);
        }

        if (transaction.getAccount() != null) {
            accountService.updateBalance(transaction.getAccount().getId());
        }
        if (transaction.getCreditCard() != null) {
            creditCardService.updateBalance(transaction.getCreditCard().getId());
        }
    }

    public void updateCurrentOthers(Transaction transaction, long transactionId, long groupId) throws Exception {
        // determine if this is a fixed group (exists in fixed table) or a parcel group
        boolean isFixedGroup = !transactionRepository.findByFixedTransactionId(groupId).isEmpty();

        if (isFixedGroup) {
            // original fixed handling
            fixedTransactionService.updateByTransaction(transaction, groupId);

            verifyTransaction(transaction);
            if (transactionId == 0) {
                transaction.setFixedTransactionId(groupId);
                create(transaction, null);
            } else {
                update(transaction, transactionId);
            }
            return;
        }

        // installment group handling
        verifyTransaction(transaction);
        if (transactionId == 0) {
            // creating a new parcel after the others - assign group id for linking
            transaction.setInstallmentGroupId(groupId);
            create(transaction, null);
            return;
        }

        // update current installment
        update(transaction, transactionId);

        // update all following installments (including current, but we already updated it)
        List<Transaction> others = transactionRepository.findCurrentAndNextByInstallmentGroup(transactionId, groupId);
        for (Transaction item : others) {
            if (item.getId().equals(transactionId)) {
                continue; // already updated
            }
            Transaction newTransaction = transaction.copy();
            newTransaction.setId(item.getId());
            newTransaction.setInstallmentGroupId(groupId);
            newTransaction.setTransactionDate(item.getTransactionDate());
            newTransaction.setPaidDate(item.getPaidDate());
            transactionRepository.save(newTransaction);
        }
    }

    public void updateAllItens(Transaction transaction, long transactionId, long groupId) throws Exception {
        // determine type
        boolean isFixedGroup = !transactionRepository.findByFixedTransactionId(groupId).isEmpty();
        if (isFixedGroup) {
            fixedTransactionService.updateByTransaction(transaction, groupId);

            verifyTransaction(transaction);

            List<Transaction> transactions = transactionRepository.findByFixedTransactionId(groupId);
            List<Transaction> newTransactions = new ArrayList<Transaction>();
            for (Transaction item : transactions) {
                Transaction newTransaction = transaction.copy();
                newTransaction.setId(item.getId());
                newTransaction.setFixedTransactionId(groupId);
                newTransaction.setTransactionDate(item.getTransactionDate());
                newTransaction.setPaidDate(item.getPaidDate());
                newTransactions.add(newTransaction);
            }
            transactionRepository.saveAll(newTransactions);

            if (transactionId == 0) {
                transaction.setFixedTransactionId(groupId);
                create(transaction, null);
            }
            return;
        }

        // installment group: update every transaction in group
        verifyTransaction(transaction);
        List<Transaction> transactions = transactionRepository.findByInstallmentGroupId(groupId);
        List<Transaction> newTransactions = new ArrayList<Transaction>();
        for (Transaction item : transactions) {
            Transaction newTransaction = transaction.copy();
            newTransaction.setId(item.getId());
            newTransaction.setInstallmentGroupId(groupId);
            newTransaction.setTransactionDate(item.getTransactionDate());
            newTransaction.setPaidDate(item.getPaidDate());
            newTransactions.add(newTransaction);
        }
        transactionRepository.saveAll(newTransactions);

        if (transactionId == 0) {
            transaction.setInstallmentGroupId(groupId);
            create(transaction, null);
        }

        // recalc balances for affected payment method
        if (transaction.getAccount() != null) {
            accountService.updateBalance(transaction.getAccount().getId());
        }
        if (transaction.getCreditCard() != null) {
            creditCardService.updateBalance(transaction.getCreditCard().getId());
        }
    }

    public void delete(long transactionId) throws Exception {
        if (transactionId == 0) {
            return;
        }

        Transaction transaction = findOne(transactionId);
        fileAttachmentService.deleteFile(transactionId);

        if (transaction.getInstallmentGroupId() != null) {
            Long groupId = transaction.getInstallmentGroupId();
            List<Transaction> installments = transactionRepository.findByInstallmentGroupId(groupId);
            transactionRepository.deleteAll(installments);
        } else {
            transactionRepository.delete(transaction);
        }

        if (transaction.getAccount() != null) {
            accountService.updateBalance(transaction.getAccount().getId());
        }
        if (transaction.getCreditCard() != null) {
            creditCardService.updateBalance(transaction.getCreditCard().getId());
        }
    }

    public void deleteCurrentOthers(long transactionId, long fixedId, String date) throws Exception {
        try {
            FixedTransaction fixedTransaction = fixedTransactionService.findOne(fixedId);
            LocalDateTime transactionDate = parseDate(date);
            List<Transaction> fixedList = transactionRepository.findByFixedTransactionIdAndTransactionDateGreaterThanEqual(fixedId, transactionDate);
            if (!fixedList.isEmpty()) {
                transactionRepository.deleteAll(fixedList);
            }    
            fixedTransactionService.delete(fixedId);
        
            if (fixedTransaction.getAccount() != null) {
                accountService.updateBalance(fixedTransaction.getAccount().getId());
            }
            if (fixedTransaction.getCreditCard() != null) {
                creditCardService.updateBalance(fixedTransaction.getCreditCard().getId());
            }
        } catch (Exception e) {
            if (transactionId > 0) {
                Transaction transaction = findOne(transactionId);

                LocalDateTime transactionDate = parseDate(date);
                List<Transaction> installmentList = transactionRepository.findByFixedTransactionIdAndTransactionDateGreaterThanEqual(fixedId, transactionDate);
                if (!installmentList.isEmpty()) {
                    transactionRepository.deleteAll(installmentList);
                }

                if (transaction.getAccount() != null) {
                    accountService.updateBalance(transaction.getAccount().getId());
                }
                if (transaction.getCreditCard() != null) {
                    creditCardService.updateBalance(transaction.getCreditCard().getId());
                }
            }
        }
    }

    public void deleteAllItens(long transactionId, long fixedId) throws Exception {
        List<Transaction> fixedList = transactionRepository.findByFixedTransactionId(fixedId);
        Transaction transaction = null;
        FixedTransaction fixedTransaction = null;

        try {
            fixedTransaction = fixedTransactionService.findOne(fixedId);
            fixedTransactionService.delete(fixedId);
        } catch (Exception e) {
            fixedId = 0;
            transaction = findOne(transactionId);
        }
    
        if (!fixedList.isEmpty()) {
            transactionRepository.deleteAll(fixedList);
        }


         if (fixedId > 0) {
            if (fixedTransaction.getAccount() != null) {
                accountService.updateBalance(fixedTransaction.getAccount().getId());
            }
            if (fixedTransaction.getCreditCard() != null) {
                creditCardService.updateBalance(fixedTransaction.getCreditCard().getId());
            }
        } else if (transactionId > 0) {
            if (transaction.getAccount() != null) {
                accountService.updateBalance(transaction.getAccount().getId());
            }
            if (transaction.getCreditCard() != null) {
                creditCardService.updateBalance(transaction.getCreditCard().getId());
            }
        }
    }

    private LocalDateTime parseDate(String date) {
        if (date == null || date.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(date);
        } catch (Exception e) {
            try {
                return LocalDate.parse(date).atStartOfDay();
            } catch (Exception ex) {
                // ignore invalid format
            }
        }
        return null;
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

        if (transaction.getAccount() != null) {
            accountService.updateBalance(transaction.getAccount().getId());
        }
        if (transaction.getCreditCard() != null) {
            creditCardService.updateBalance(transaction.getCreditCard().getId());
        }
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
