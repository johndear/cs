package models;

import java.io.Serializable;
import javax.persistence.*;

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
public class AsoTaskPublish extends Model {

	@Column(name="app_order")
	private int appOrder;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="create_time")
	private Date createTime;

	private String createby;

	private int deleted;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="end_time")
	private Date endTime;

	@Column(name="join_piece")
	private int joinPiece;

	private String keyword;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="modify_time")
	private Date modifyTime;

	private String modifyby;

	@Column(name="order_no")
	private int orderNo;

	@Column(name="setting_piece")
	private int settingPiece;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="start_time")
	private Date startTime;

	@Column(name="task_status")
	private int taskStatus;

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
	private List<AsoChannel> asoChannels;

	//bi-directional many-to-one association to AsoTask
	@ManyToOne
	@JoinColumn(name="task_id")
	private AsoTask asoTask;

	public AsoTaskPublish() {
	}

	public int getAppOrder() {
		return this.appOrder;
	}

	public void setAppOrder(int appOrder) {
		this.appOrder = appOrder;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getCreateby() {
		return this.createby;
	}

	public void setCreateby(String createby) {
		this.createby = createby;
	}

	public int getDeleted() {
		return this.deleted;
	}

	public void setDeleted(int deleted) {
		this.deleted = deleted;
	}

	public Date getEndTime() {
		return this.endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public int getJoinPiece() {
		return this.joinPiece;
	}

	public void setJoinPiece(int joinPiece) {
		this.joinPiece = joinPiece;
	}

	public String getKeyword() {
		return this.keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public Date getModifyTime() {
		return this.modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	public String getModifyby() {
		return this.modifyby;
	}

	public void setModifyby(String modifyby) {
		this.modifyby = modifyby;
	}

	public int getOrderNo() {
		return this.orderNo;
	}

	public void setOrderNo(int orderNo) {
		this.orderNo = orderNo;
	}

	public int getSettingPiece() {
		return this.settingPiece;
	}

	public void setSettingPiece(int settingPiece) {
		this.settingPiece = settingPiece;
	}

	public Date getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public int getTaskStatus() {
		return this.taskStatus;
	}

	public void setTaskStatus(int taskStatus) {
		this.taskStatus = taskStatus;
	}

	public List<AsoChannel> getAsoChannels() {
		return this.asoChannels;
	}

	public void setAsoChannels(List<AsoChannel> asoChannels) {
		this.asoChannels = asoChannels;
	}

	public AsoTask getAsoTask() {
		return this.asoTask;
	}

	public void setAsoTask(AsoTask asoTask) {
		this.asoTask = asoTask;
	}

}