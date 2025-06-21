package com.br.ggastosservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.ggastosservice.model.FileAttachment;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {

}
