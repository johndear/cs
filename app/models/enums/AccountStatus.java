package models.enums;

public enum AccountStatus {

	NORMAL("正常", 0),
    FREEZE("冻结", 1);
    

    private String display;
    private int index;

    private AccountStatus(String display, int index) {
        this.display =display;
        this.index = index;
    }

    public String display() {
    	return this.display;
    }

}
