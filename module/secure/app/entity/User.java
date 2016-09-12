package entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Lists;

import net.sf.oval.constraint.NotBlank;
import play.db.jpa.Model;

@Entity
@Table(name = "tb_user")
//默认的缓存策略.
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class User extends Model {
	@Column(name="user_name")
	public String userName;
	@Column(name="login_name")
	public String loginName;
	public String password;
	public String sex;
	public Date birthday;
	public String salt;
	public String email;
	
//	private List<Role> roleList = Lists.newArrayList(); // 有序的关联对象集合

	public User() {
	}

	public User(Long id) {
		this.id = id;
	}

//	@NotBlank

//	// 不持久化到数据库，也不显示在Restful接口的属性.
//	@Transient
//	@JsonIgnore
//	public String getPlainPassword() {
//		return plainPassword;
//	}
//
//	public void setPlainPassword(String plainPassword) {
//		this.plainPassword = plainPassword;
//	}

//	// 多对多定义 -- 属性(fetch=FetchType.EAGER)就不是lazy load
//	@ManyToMany
//	@JoinTable(name = "tb_user_role", schema="ydscm_permission", joinColumns = { @JoinColumn(name = "user_id") }, inverseJoinColumns = { @JoinColumn(name = "role_id") })
//	// Fecth策略定义
//	@Fetch(FetchMode.SUBSELECT)
//	// 集合按id排序
//	@OrderBy("id ASC")
//	// 缓存策略
//	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
//	public List<Role> getRoleList() {
//		return roleList;
//	}
//
//	public void setRoleList(List<Role> roleList) {
//		this.roleList = roleList;
//	}

	// @Transient
	// @JsonIgnore
	// public List<String> getRoleList() {
	// // 角色列表在数据库中实际以逗号分隔字符串存储，因此返回不能修改的List.
	// return ImmutableList.copyOf(StringUtils.split(roles, ","));
	// }

	// // 设定JSON序列化时的日期格式
	// @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+08:00")
	// public Date getRegisterDate() {
	// return registerDate;
	// }
	//
	// public void setRegisterDate(Date registerDate) {
	// this.registerDate = registerDate;
	// }

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}