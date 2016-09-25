package models;

import java.io.Serializable;

import javax.persistence.*;

import controllers.CRUD.Exclude;
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

	@Exclude
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="create_time")
	public Date createTime;

	@Exclude
	public String createby;

	private int deleted;

	private String description;

	@Exclude
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="modify_time")
	private Date modifyTime;

	@Exclude
	private String modifyby;

	private BigInteger pid;

	//bi-directional many-to-many association to AsoTaskPublish
	@ManyToMany(mappedBy="asoChannels")
	private List<AsoTaskPublish> asoTaskPublishs;

	@Override
	public String toString() {
		return this.channelName;
	}
}