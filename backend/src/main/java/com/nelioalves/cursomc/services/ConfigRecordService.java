package com.nelioalves.cursomc.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nelioalves.cursomc.domain.ConfigRecord;
import com.nelioalves.cursomc.repositories.ConfigRecordRepository;
import java.sql.Time;
import java.text.SimpleDateFormat;
@Service
public class ConfigRecordService {

    @Autowired
    private final ConfigRecordRepository configRecordRepository;

    public ConfigRecordService(ConfigRecordRepository configRecordRepository) {
        this.configRecordRepository = configRecordRepository;
    }

    //get information of the database
    public List<ConfigRecord> getAllConfigRecords() {

        return configRecordRepository.findAll();
    }

    // disable all the automations
    public int disableAllAutomations() {
        return configRecordRepository.disableAllAutomations();
    }
    // disable all the automations
    public int enableAllAutomations() {
        return configRecordRepository.enableAllAutomations();
    }
    //disable by type
    public int disableAutomationByType(String type) {
        return configRecordRepository.disableAutomationByType(type);
    }
    public int enableAutomationByType(String type) {
        return configRecordRepository.enableAutomationByType(type);
    }
    // change the default hour to execute the automation
    public int changeOverrideTimeByType(String type, String overrideTime) throws Exception {
        SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
        Time time = new Time(format.parse(overrideTime).getTime());
        return configRecordRepository.updateOverrideTimeByType(type, time);
    }
}
