package models;

import java.io.Serializable;

import javax.persistence.*;

import annotation.ListColumn;
import play.db.jpa.Model;

import java.util.Date;
import java.util.List;


/**
 * The persistent class for the aso_task_publish database table.
 * 
 */
@Entity
@Table(name="aso_task_publish")
@NamedQuery(name="AsoTaskPublish.findAll", query="SELECT a FROM AsoTaskPublish a")
public class AsoTaskPublish extends BaseModel {

	public String keyword;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="start_time")
	public Date startTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="end_time")
	public Date endTime;

	//bi-directional many-to-one association to AsoTask
	@ListColumn(fields="taskName,taskType,taskScore")
	@ManyToOne
	@JoinColumn(name="task_id")
	public AsoTask asoTask;

	//bi-directional many-to-many association to AsoChannel
	@ManyToMany
	@JoinTable(
			name="aso_publish_channel"
			, joinColumns={
			@JoinColumn(name="publish_id")
	}
			, inverseJoinColumns={
			@JoinColumn(name="channel_id")
	}
	)
	public List<AsoChannel> asoChannels;

	@Column(name="app_order")
	public int appOrder;



	@Column(name="join_piece")
	public int joinPiece;



	@Column(name="order_no")
	public int orderNo;

	@Column(name="setting_piece")
	public int settingPiece;



	@Column(name="task_status")
	public int taskStatus;






}