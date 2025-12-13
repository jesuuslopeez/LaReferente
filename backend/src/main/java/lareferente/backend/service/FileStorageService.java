package lareferente.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    public String storeFile(MultipartFile file) {
        try {
            // Inicializar la ubicación de almacenamiento si no existe
            if (fileStorageLocation == null) {
                this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
                Files.createDirectories(this.fileStorageLocation);
            }

            // Validar el archivo
            if (file.isEmpty()) {
                throw new RuntimeException("No se puede almacenar un archivo vacío");
            }

            // Validar tipo de archivo (solo imágenes)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Solo se permiten archivos de imagen");
            }

            // Generar nombre único
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Guardar archivo
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo almacenar el archivo. Error: " + ex.getMessage());
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            if (fileStorageLocation == null) {
                this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            }

            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("Archivo no encontrado: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Archivo no encontrado: " + fileName);
        }
    }

    public void deleteFile(String fileName) {
        try {
            if (fileStorageLocation == null) {
                this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            }

            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo eliminar el archivo: " + fileName);
        }
    }
}
