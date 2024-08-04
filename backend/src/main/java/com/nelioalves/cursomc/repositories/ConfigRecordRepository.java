package com.nelioalves.cursomc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.nelioalves.cursomc.domain.ConfigRecord;
import java.sql.Time;

@Repository
public interface ConfigRecordRepository extends JpaRepository<ConfigRecord, Integer> {

    @Modifying
    @Transactional
    @Query("UPDATE ConfigRecord c SET c.status = false")
    int disableAllAutomations();

    @Modifying
    @Transactional
    @Query("UPDATE ConfigRecord c SET c.status = true")
    int enableAllAutomations();

    @Modifying
    @Transactional
    @Query("UPDATE ConfigRecord c SET c.status = false WHERE c.type = :type")
    int disableAutomationByType(String type);

    @Modifying
    @Transactional
    @Query("UPDATE ConfigRecord c SET c.status = true WHERE c.type = :type")
    int enableAutomationByType(String type);

    @Modifying
    @Transactional
    @Query("UPDATE ConfigRecord c SET c.overrideTime = :overrideTime WHERE c.type = :type")
    int updateOverrideTimeByType(String type, Time overrideTime);
}
