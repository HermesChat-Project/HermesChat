package models


type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SignUpRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Name    string `json:"name" binding:"required"`
	Surname    string `json:"surname" binding:"required"`
	Lang   string `json:"lang" binding:"required"`
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
	IDUser string `bson:"idUser" json:"idUser"` 
	Image string `json:"image"`
	Name string `json:"name"`
	Surname string `json:"surname"`
}

type AddCalendarEvent struct {
	Title string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Date string `json:"date" binding:"required"`
	Type string `json:"type" binding:"required"`
	IdUser string `json:"idUser" binding:"required"`
	Notify bool `json:"notify" binding:"required"`
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
type RefuseFriendRequest struct {
	IdFriend string `json:"idUser" binding:"required"`
}

type CreateChat struct {
	IdUser string `json:"idUser" binding:"required"`
	FirstImg string `json:"img" binding:"required"`
	SecondImg string `json:"friendImg" binding:"required"`
	FirstNickname string `json:"nickname" binding:"required"`
	SecondNickname string `json:"friendNickname" binding:"required"`
}

type CreateGroup struct {
	Name string `json:"name" binding:"required"`
	Users []string `json:"users" binding:"required"`
}

type GetMessages struct{
	IdChat string `json:"idChat" binding:"required"`
	Offset int `json:"offset" binding:"required"`
}

type CheckOtp struct {
	Nickname string `json:"nickname" binding:"required"`
	Otp string `json:"otp" binding:"required"`
}


//Socket

type Request struct {
	Type string `json:"type"`
	FlagGroup bool `json:"flagGroup"`
	IdDest string `json:"idDest"`
	Payload string `json:"payload"`
	Options string `json:"options"`
	Index string `json:"index"`
	TypeMSG string `json:"typeMSG"`
}


type Info struct {
	Index string `json:"idUser"`
	Nickname string `json:"nickname"`
	Name string `json:"name"`
	Surname string `json:"surname"`
	Image string `json:"image"`
}

type GetFilesRequest struct {
	Url string `json:"urls"`
	ChatId string `json:"chatId"`
}

type CreateGroupRequest struct {
	Name string `json:"name"`
	Users []string `json:"users"`
	Description string `json:"description"`
	Img string `json:"img"`
}

type AddUserToGroupRequest struct {
	ChatId string `json:"chatId"`
	Users []string `json:"users"`
}

type ChangeRoleGroup struct {
	ChatId string `json:"chatId"`
	User string `json:"user"`
	Role string `json:"role"`
}

type RemoveUserFromGroupRequest struct {
	ChatId string `json:"chatId"`
	UserId string `json:"userId"`
}

type RemoveFriend struct {
	UserId string `json:"userId"`
}

type LeaveGroupRequest struct {
	ChatId string `json:"chatId"`
}