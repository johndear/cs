package models;

import javax.persistence.Entity;
import javax.persistence.Table;

import play.db.jpa.Model;

@Entity
@Table(name="tb_user")
public class User extends Model {

    public String email;
    public String password;
    public String fullname;
    public boolean isAdmin;
    
    public String name;
    public String avatarUrl;

    // Twitter
    public String token;
    public String secret;

    // Facebook
    public String accessToken;
    
    public User(){}

    public User(String email, String password, String fullname) {
        this.email = email;
        this.password = password;
        this.fullname = fullname;
    }
    
    public static User connect(String email, String password) {
        return find("byEmailAndPassword", email, password).first();
    }

}
