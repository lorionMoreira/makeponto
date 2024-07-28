package com.nelioalves.cursomc.resources;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping(value = "/api/test/")
public class TestResource {

    @GetMapping("/version")
    public ResponseEntity<String> getAutomationSettings() {
        String version = "version system test: 1.4";

        return ResponseEntity.ok(version); 
    }
}
