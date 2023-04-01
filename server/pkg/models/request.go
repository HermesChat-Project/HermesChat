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
	Index string `json:"index" binding:"required"`
	Username string `json:"username" binding:"required"`
}

