package models;

import java.io.Serializable;
import javax.persistence.*;

import play.data.validation.Required;
import play.db.jpa.Model;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the aso_channel database table.
 * 
 */
@Entity
@Table(name="aso_channel")
public class AsoChannel extends Model {

	@Column(name="channel_code")
	@Required(message="You have to select the type of the event.")
	public String channelCode;

	@Column(name="channel_name")
	public String channelName;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="create_time")
	public Date createTime;

	public String createby;

	private int deleted;

	private String description;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="modify_time")
	private Date modifyTime;

	private String modifyby;

	private BigInteger pid;

	//bi-directional many-to-many association to AsoTaskPublish
	@ManyToMany(mappedBy="asoChannels")
	private List<AsoTaskPublish> asoTaskPublishs;

	public AsoChannel() {
	}

	public String getChannelCode() {
		return this.channelCode;
	}

	public void setChannelCode(String channelCode) {
		this.channelCode = channelCode;
	}

	public String getChannelName() {
		return this.channelName;
	}

	public void setChannelName(String channelName) {
		this.channelName = channelName;
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

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public BigInteger getPid() {
		return this.pid;
	}

	public void setPid(BigInteger pid) {
		this.pid = pid;
	}

	public List<AsoTaskPublish> getAsoTaskPublishs() {
		return this.asoTaskPublishs;
	}

	public void setAsoTaskPublishs(List<AsoTaskPublish> asoTaskPublishs) {
		this.asoTaskPublishs = asoTaskPublishs;
	}

}