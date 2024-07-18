package com.nelioalves.cursomc.resources;

import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.nelioalves.cursomc.domain.ConfigRecord;
import com.nelioalves.cursomc.services.ConfigRecordService;

@RestController
@RequestMapping(value = "/api/records")
public class ConfigRecordController {

    @Autowired
    private final ConfigRecordService configRecordService;

    public ConfigRecordController(ConfigRecordService configRecordService) {
        this.configRecordService = configRecordService;
    }

    @GetMapping("/settings")
    public List<ConfigRecord> getAutomationSettings() {
        return configRecordService.getAllConfigRecords();
    }

    @PostMapping("/disable-all")
    public ResponseEntity<?> disableAllAutomations() {
        int updatedCount = configRecordService.disableAllAutomations();
        if (updatedCount == 0) {
            return ResponseEntity.notFound().build();  // No records found to update
        }
        List<ConfigRecord> allConfigRecords = configRecordService.getAllConfigRecords();
        return ResponseEntity.ok(allConfigRecords);  // Returns HTTP 200 with count of disabled automations
    }

    @PostMapping("/disable/{type}")
    public ResponseEntity<?> disableAutomationByType(@PathVariable String type) {
        int updatedCount = configRecordService.disableAutomationByType(type);
        if (updatedCount == 0) {
            return ResponseEntity.notFound().build();  // No record was found with the given type, or it was already disabled
        }
        // Assuming getAllConfigRecords returns a list of config records
        List<ConfigRecord> allConfigRecords = configRecordService.getAllConfigRecords();
        return ResponseEntity.ok(allConfigRecords);
        // return ResponseEntity.ok("Automation of type '" + type + "' has been disabled.");  // Successfully disabled the automation
    }

    @PostMapping("/enable/{type}")
    public ResponseEntity<?> enableAutomationByType(@PathVariable String type) {
        int updatedCount = configRecordService.enableAutomationByType(type);
        if (updatedCount == 0) {
            return ResponseEntity.notFound().build();  // No record was found with the given type, or it was already disabled
        }
        // Assuming getAllConfigRecords returns a list of config records
        List<ConfigRecord> allConfigRecords = configRecordService.getAllConfigRecords();
        return ResponseEntity.ok(allConfigRecords);
        // return ResponseEntity.ok("Automation of type '" + type + "' has been disabled.");  // Successfully disabled the automation
    }

    @PostMapping("/change/{type}")
    public ResponseEntity<?> changeOverrideTime(@PathVariable String type, @RequestParam String overrideTime) {
        try {
            int updatedCount = configRecordService.changeOverrideTimeByType(type, overrideTime);
            if (updatedCount == 0) {
                return ResponseEntity.notFound().build();  // No record was found with the given type
            }
            List<ConfigRecord> allConfigRecords = configRecordService.getAllConfigRecords();
            return ResponseEntity.ok(allConfigRecords);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid time format. Please use HH:mm:ss format.");
        }
    }

}
