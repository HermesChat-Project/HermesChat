package models

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SignUpRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

//for every api call from now it's required the token, which will be put by the server in the index value of the header
type UpdateInfo struct {
	NewInfo string `json:"newInfo" binding:"required"`
}

type SendFriendRequest struct {
	Username string `json:"username" binding:"required"`
}

type BlockUser struct {
	Username string `json:"username" binding:"required"`
}

type Friend struct {
	Nickname string `json:"nickname"`
	ID string `json:"idUser"`
	Image string `json:"image"`
}

type AddCalendarEvent struct {
	Title string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Date string `json:"date" binding:"required"`
	Type string `json:"type" binding:"required"`
	IdUser string `json:"idUser" binding:"required"`
	Notify string `json:"notify" binding:"required"`
	NotifyTime string `json:"notifyTime" binding:"required"`
	Color string `json:"color" binding:"required"`
	IdChats []string `json:"idChats"`
}

type DeleteCalendarEvent struct {
	IdEvent string `json:"idEvent" binding:"required"`
}

type UpdateCalendarEvent struct {
	IdEvent string `json:"idEvent" binding:"required"`
	Title string `json:"title"`
	Description string `json:"description"`
	Date string `json:"dateTime"`
	Type string `json:"type"`
	Notify string `json:"notify"`
	NotifyTime string `json:"notifyTime"`
	Color string `json:"color"`
	IdChats []string `json:"idChats"`
}

type AcceptFriendRequest struct {
	IdFriend string `json:"idUser" binding:"required"`
	Nickname string `json:"nickname" binding:"required"`
	Name string `json:"name" binding:"required"`
	Surname string `json:"surname" binding:"required"`
	Image string `json:"image" binding:"required"`
}