package models;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;

import java.util.Date;
import java.util.List;


/**
 * The persistent class for the aso_task database table.
 * 
 */
@Entity
@Table(name="aso_task")
@NamedQuery(name="AsoTask.findAll", query="SELECT a FROM AsoTask a")
public class AsoTask extends Model {


	@Column(name="app_id")
	private String appId;

	@Column(name="app_name")
	private String appName;

	@Column(name="callback_url")
	private String callbackUrl;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="create_time")
	private Date createTime;

	private String createby;

	@Lob
	@Column(name="deep_description")
	private String deepDescription;

	@Column(name="deep_score")
	private int deepScore;

	private int deleted;

	@Lob
	private String description;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="forecast_end_time")
	private Date forecastEndTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="forecast_start_time")
	private Date forecastStartTime;

	private String icon;

	@Column(name="is_forecast")
	private int isForecast;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="modify_time")
	private Date modifyTime;

	private String modifyby;

	@Column(name="process_name")
	private String processName;

	private String scheme;

	@Column(name="task_name")
	private String taskName;

	@Column(name="task_score")
	private int taskScore;

	@Column(name="task_title")
	private String taskTitle;

	@Column(name="task_type")
	private String taskType;

	//bi-directional many-to-one association to AsoTaskPublish
	@OneToMany(mappedBy="asoTask")
	private List<AsoTaskPublish> asoTaskPublishs;

	public AsoTask() {
	}

	public String getAppId() {
		return this.appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getAppName() {
		return this.appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}

	public String getCallbackUrl() {
		return this.callbackUrl;
	}

	public void setCallbackUrl(String callbackUrl) {
		this.callbackUrl = callbackUrl;
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

	public String getDeepDescription() {
		return this.deepDescription;
	}

	public void setDeepDescription(String deepDescription) {
		this.deepDescription = deepDescription;
	}

	public int getDeepScore() {
		return this.deepScore;
	}

	public void setDeepScore(int deepScore) {
		this.deepScore = deepScore;
	}

	public int getDeleted() {
		return this.deleted;
	}

	public void setDeleted(int deleted) {
		this.deleted = deleted;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getForecastEndTime() {
		return this.forecastEndTime;
	}

	public void setForecastEndTime(Date forecastEndTime) {
		this.forecastEndTime = forecastEndTime;
	}

	public Date getForecastStartTime() {
		return this.forecastStartTime;
	}

	public void setForecastStartTime(Date forecastStartTime) {
		this.forecastStartTime = forecastStartTime;
	}

	public String getIcon() {
		return this.icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public int getIsForecast() {
		return this.isForecast;
	}

	public void setIsForecast(int isForecast) {
		this.isForecast = isForecast;
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

	public String getProcessName() {
		return this.processName;
	}

	public void setProcessName(String processName) {
		this.processName = processName;
	}

	public String getScheme() {
		return this.scheme;
	}

	public void setScheme(String scheme) {
		this.scheme = scheme;
	}

	public String getTaskName() {
		return this.taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public int getTaskScore() {
		return this.taskScore;
	}

	public void setTaskScore(int taskScore) {
		this.taskScore = taskScore;
	}

	public String getTaskTitle() {
		return this.taskTitle;
	}

	public void setTaskTitle(String taskTitle) {
		this.taskTitle = taskTitle;
	}

	public String getTaskType() {
		return this.taskType;
	}

	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}

	public List<AsoTaskPublish> getAsoTaskPublishs() {
		return this.asoTaskPublishs;
	}

	public void setAsoTaskPublishs(List<AsoTaskPublish> asoTaskPublishs) {
		this.asoTaskPublishs = asoTaskPublishs;
	}

	public AsoTaskPublish addAsoTaskPublish(AsoTaskPublish asoTaskPublish) {
		getAsoTaskPublishs().add(asoTaskPublish);
		asoTaskPublish.setAsoTask(this);

		return asoTaskPublish;
	}

	public AsoTaskPublish removeAsoTaskPublish(AsoTaskPublish asoTaskPublish) {
		getAsoTaskPublishs().remove(asoTaskPublish);
		asoTaskPublish.setAsoTask(null);

		return asoTaskPublish;
	}

}