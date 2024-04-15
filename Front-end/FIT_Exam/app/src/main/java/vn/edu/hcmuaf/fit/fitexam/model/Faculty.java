package vn.edu.hcmuaf.fit.fitexam.model;

import java.io.Serializable;
import java.util.List;

public class Faculty implements Serializable {
    private int id;
    private String name;
    private List<User> users;

    public Faculty() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
