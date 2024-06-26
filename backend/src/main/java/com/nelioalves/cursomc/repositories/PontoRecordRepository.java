package com.nelioalves.cursomc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nelioalves.cursomc.domain.ConfigRecord;

@Repository
public  interface PontoRecordRepository extends JpaRepository<ConfigRecord, Integer>{

}
