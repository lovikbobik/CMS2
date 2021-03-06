import React, {useContext, useEffect, useState} from "react";
import '../../styles/components/Profile/Profile.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Avatar, Button} from "@material-ui/core";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import profileElements from "../../Arrays/profileElements";
import {NavLink} from "react-router-dom";
import ProfileTweets from "./SubItems/ProfileTweets"
import FollowWidgetDetails from "../Widgets/FollowWidgetDetails";
import {useFetch} from "../../Hook/useFetch.hook";
import {AuthContext} from "../Auth/AuthContext";
function Profile({
                     tweetCount = profileElements.tweetCount,
                     poster = profileElements.poster,
                     username = profileElements.username,
                     verified = profileElements.verified,
                     text = profileElements.text,
                     location = profileElements.location,
                     link = profileElements.link,
                     date = profileElements.date,
                     following = profileElements.following,
                     followers = profileElements.followers,
                     children = <ProfileTweets/>
                 }
) {
    const {request} = useFetch()
    const [user, setUser] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await request('/users');
            setUser(response);
        };
        fetchData();
    }, [setUser]);
    const account = useContext(AuthContext)
    const [name, setName] = useState({})
    useEffect(() => {
        const getName = async () => {
            const response = await request(`/auth/${account.userId}`)
            setName(response)
        }
        getName()

    }, [setName])
    return (
        <div className="profile">

            <div className="profile__header">
                <ArrowBackIcon className="profile__icon"/>
                <div className="profile__headerText">
                    <h2>{name.name}</h2>
                    <p>{tweetCount + " ????????????"}</p>
                </div>
            </div>

            <div>
                <img className="profile__background"
                     src={poster}/>
            </div>

            <div className="profile__follow">
                <div>
                    <Avatar className="profile__avatar" src={name.avatar}/>
                </div>
                <Button variant="outlined" className="profile__button">?????????????????? ??????????????</Button>
            </div>

            <div className="profile__info">

                <div className="profile__user">
                    <h2>{name.name} {verified &&
                    <VerifiedIcon className="profile__verified" fontSize="small"/>}</h2>
                    <p>{"@" + username}</p>
                </div>

                <div>
                    <p>{text}</p>
                </div>

                <div className="profile_description">
                    <span className="align"><LocationOnOutlinedIcon/> {location}</span>
                    <span className="align">
                        <LinkOutlinedIcon/>
                        <a className={"profile__link"} href={link}>?????? ??????????????????</a>
                    </span>
                    <span className="align"><DateRangeOutlinedIcon/> {date}</span>
                </div>

                <div className="profile__followers">
                    <span> <b className="profile__black">{following + " "}</b> ?????????????? </span>
                    <span className="follow__dist"> <b
                        className="profile__black">{followers + " "}</b>??????????????????????</span>
                </div>
            </div>
            <div className={"tabs"}>
                <div className={"tabs__header"}>
                    <NavLink className={"tabs__nav"} to={'/profile'}>??????????</NavLink>
                    <NavLink className={"tabs__nav"} to={'/profile/replies'}>?????????? & ????????????</NavLink>
                    <NavLink className={"tabs__nav"} to={'/profile/media'}>??????????</NavLink>
                    <NavLink className={"tabs__nav"} to={'/profile/likes'}>????????????????</NavLink>
                </div>

                <div className={"tabs__content"}>
                    {children}
                </div>
                <div className="profile__explore">
                    <h2>???? ?????? ??????????????????</h2>

                    <div className={"profile__widget"}>
                        {user.map(items => {
                                if (!items.verified) {
                                    return <FollowWidgetDetails item={items}/>
                                }
                            }
                        )}
                    </div>
                    <a className="profile__widgetMore" href="#">???????????????? ??????</a>
                </div>
            </div>
        </div>
    )
}

export default Profile;
