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
public class AsoTask extends BaseModel {

	@Column(name="app_id")
	public String appId;

	@Column(name="app_name")
	public String appName;

	@Column(name="callback_url")
	public String callbackUrl;

	@Lob
	@Column(name="deep_description")
	public String deepDescription;

	@Column(name="deep_score")
	public int deepScore;

	@Lob
	public String description;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="forecast_end_time")
	public Date forecastEndTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="forecast_start_time")
	public Date forecastStartTime;

	public String icon;

	@Column(name="is_forecast")
	public int isForecast;

	@Column(name="process_name")
	public String processName;

	public String scheme;

	@Column(name="task_name")
	public String taskName;

	@Column(name="task_score")
	public int taskScore;

	@Column(name="task_title")
	public String taskTitle;

	@Column(name="task_type")
	public String taskType;

	//bi-directional many-to-one association to AsoTaskPublish
	@OneToMany(mappedBy="asoTask")
	public List<AsoTaskPublish> asoTaskPublishs;

	public AsoTaskPublish addAsoTaskPublish(AsoTaskPublish asoTaskPublish) {
		asoTaskPublishs.add(asoTaskPublish);
		asoTaskPublish.asoTask = this;

		return asoTaskPublish;
	}

	public AsoTaskPublish removeAsoTaskPublish(AsoTaskPublish asoTaskPublish) {
		asoTaskPublishs.remove(asoTaskPublish);
		asoTaskPublish.asoTask = this;

		return asoTaskPublish;
	}

	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return this.taskName;
	}
}