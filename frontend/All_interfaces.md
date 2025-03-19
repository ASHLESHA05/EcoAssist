
1. sideBAR (/get-userDetails) [GET]
```
--------------------------------------------
### return Type:
interface userDetails{
  name: string,
  email:string,
  joinedDate: Date,
  Location : string,
  Level : number ,
  levelProgress: number,
  profileVisibility : boolean (true is ``visible`` false: ``private``)
}
API Endpoints:
    /get-userDetails
    params: {
        name: user?.name, // Pass user name
        email: user?.email, // Pass user email
    },

```
------------------------------------------------------------------------------
2. Notification Table (/get-notificationSettings?email=${user?.email}) [GET]

email | dailyTips(bool) | AchievementAlert(bool) | FriendActivity(bool)

return Type
interface NotificationType{
    dailyTips : bool,
    AchievementAlert: bool,
    FriendActivity: bool
}

------------------------------------------------------------------------------
3. Update Notification (/update-notifications) [POST]
parms:
        {
          key,
          value: newState[key],
          name: user?.name,
          email: user?.email,
        },
key is : "dailyTips" || "AchievementAlert" || "FriendActivity"

------------------------------------------------------------------------------
4. Update profile (/update-user) ['PUT']
        {
          email: user.email,
          userData: {
            name: userData.name,
            email: userData.email,
            joinedDate: userData.joinedDate,
            Location: userData.Location,
            Level: userData.Level,
            levelProgress: userData.levelProgress,
            profileVisibility: userData.profileVisibility,
          },
        },
--------------------------------------------------------------------------------
5. Update Profile Visibility (/update-profile-visibility) ['POST']
{
    email: user.email,
    profileVisibility: newVisibility,
},

--------------------------------------------------------------------------------
6. Delete User (delte all details of hat user)  (/delete-user) ['DELETE']
params: {
            email: userData?.email,
},
--------------------------------------------------------------------------------
7. Get all details (/get-all-details)
{

}
-------------------------------------------------------------------------------
8. Get Suggestion cards ( fetch behaviour from db and pass to gen AI model) (/get-Suggestions) [GET]
params: {
    name: user?.name, // Pass user name
    email: user?.email, // Pass user email
},

return Type:
[
    {
      title: "Reduce Commute Impact",
      description: "Try carpooling or public transit "
      icon: Car,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {.....},...
]
-------------------------------------------------------------------------------
9. API req to AI model (/get-Suggestion-desc) [GET]
params: {
  title : data.title,
  description : data.description
},
returnType:
{
  detail : string,
  link : article_link
}
-------------------------------------------------------------------------------
9. API req to AI model (/get-Actions) [GET]
params:{
  email : user?.email
}
returnType:
//Analyse use Behaviour and give
[{
    title: "Log a car-free day",
    icon: Car, //An react component
    points: 5, 
}]
-------------------------------------------------------------------------------

10. 