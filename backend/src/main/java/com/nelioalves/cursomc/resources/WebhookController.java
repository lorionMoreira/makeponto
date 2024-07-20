package com.nelioalves.cursomc.resources;

import java.nio.file.Files;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping(value = "/api/pipeline")
public class WebhookController {


    @PostMapping("/start")
    public void handleWebhook(@RequestBody String payload) {
        System.out.println("Received webhook payload: " + payload);

        // Path to the script
        String scriptPath = "/srv/vendas/output/my_script.sh";

        try {
            // Execute the script
            ProcessBuilder processBuilder = new ProcessBuilder(scriptPath);
            processBuilder.directory(new java.io.File("/srv/vendas/output")); // Set script execution directory
            Process process = processBuilder.start();

            // Read output of the script
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            int exitCode = process.waitFor();
            System.out.println("Executed script exited with code " + exitCode);

        } catch (IOException | InterruptedException e) {
            System.err.println("Error during script execution: " + e.getMessage());
            e.printStackTrace();
        }
    }
    /* 
    @PostMapping("/start2")
    public void handleWebhook2(@RequestBody String payload) {
        System.out.println("Received webhook payload: " + payload);

        // Use the system-specific separator to avoid issues
        String directory = "output"; // Example directory name
        String fileName = "hello-world.txt";
        Path path = Paths.get(directory, fileName);

        // Ensure directory exists
        try {
            Files.createDirectories(path.getParent());
        } catch (IOException e) {
            System.err.println("Error creating directories: " + e.getMessage());
            return;
        }

        String content = "hello world!";
        try {
            Files.write(path, content.getBytes());
            System.out.println("File created successfully at " + path.toString());
        } catch (IOException e) {
            System.out.println("Failed to create the file.");
            e.printStackTrace();
        }
    }
        */
}
