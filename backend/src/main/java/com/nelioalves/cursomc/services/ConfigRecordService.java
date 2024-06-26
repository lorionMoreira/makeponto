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

    public List<ConfigRecord> getAllConfigRecords() {

        return configRecordRepository.findAll();
    }
    public int disableAllAutomations() {
        return configRecordRepository.disableAllAutomations();
    }

    public int disableAutomationByType(String type) {
        return configRecordRepository.disableAutomationByType(type);
    }

    public int changeOverrideTimeByType(String type, String overrideTime) throws Exception {
        SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
        Time time = new Time(format.parse(overrideTime).getTime());
        return configRecordRepository.updateOverrideTimeByType(type, time);
    }
}
