package com.br.ggastosservice.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.br.ggastosservice.model.FileAttachment;
import com.br.ggastosservice.repository.FileAttachmentRepository;

@Service
public class FileAttachmentService {

    private FileAttachmentRepository fileRepository;

    public FileAttachmentService(FileAttachmentRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public FileAttachment findOne(long id) throws Exception {
        Optional<FileAttachment> file = fileRepository.findById(id);
        if (file == null || !file.isPresent()) {
            throw new Exception("File type ID: " +id+ ", não encontrado!");
        }
        return file.get();
    }

    public FileAttachment verifyAndSaveFile(MultipartFile multipartFile) throws Exception {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }

        String uploadDir = "data/images";

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String hash = UUID.randomUUID().toString();

        String originalFilename = multipartFile.getOriginalFilename();
        String fileName = hash + "_" + originalFilename;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        FileAttachment file = new FileAttachment();
        file.setName(originalFilename);
        file.setHash(hash);
        file.setSize((int) multipartFile.getSize());
        file.setType(multipartFile.getContentType());
        file.setPath(filePath.toString());
        file.setCreateDate(LocalDateTime.now());

        this.fileRepository.save(file);
        return file;
    }

    public void deleteFile(long fileId) throws Exception {
        FileAttachment fileAttachment = findOne(fileId);

        Path filePath = Paths.get(fileAttachment.getPath());
        try {
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            throw new Exception("Erro ao deletar o arquivo físico: ");
        }
    }

    public File download(long fileId) throws Exception {
        FileAttachment file = findOne(fileId);

        File finalFile = new File(file.getPath());

        return finalFile;
    }
}
