package com.nelioalves.cursomc.resources;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/api/pipeline")
public class WebhookController {

    @Value("${webhook.secret}")
    private String secret;

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.OK)
    public void handleWebhook(@RequestHeader("X-Hub-Signature-256") String signature, @RequestBody String payload, HttpServletRequest request) {
        if (!validateSecret(signature, payload)) {
            throw new SecurityException("Invalid secret5");
        }

        System.out.println("Received webhook payload2: " + payload);

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

    private boolean validateSecret(String signature, String payload) {
        String hash = "sha256=" + hmacSHA256(payload, secret);
        return hash.equals(signature);
    }

    private String hmacSHA256(String data, String secret) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes());
            return bytesToHex(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC SHA256", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}
