package com.nelioalves.cursomc.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.JoinColumn;
import java.sql.Time;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "pontorecords")
public class PontoRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "automation_id")
    private Integer automationId;

    @Column(nullable = false)
    private Time ponto;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "automation_id", insertable = false, updatable = false)
    private ConfigRecord configRecord;
    
}
