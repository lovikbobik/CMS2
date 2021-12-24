import React from "react";
import '../../styles/components/Main/Main.css';
import Tweet from './Tweet.js';
import Post from "../Post/Post";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import mainPostElements from "../../Arrays/mainPostElements";

function Main() {
    return (
            <div className="main">
                <div className="main__header">
                    <h2>Главная </h2>
                    <AutoAwesomeOutlinedIcon className="main__auto"/>
                </div>
                <Tweet/>
                {mainPostElements.map((item, index) => {
                    return (
                        <Post
                            name={item.name}
                            avatar={item.avatar}
                            verified={item.verified && true}
                            username={item.username}
                            date={item.date}
                            text={item.text}
                            image={item.image}
                            likeCount={item.likeCount}
                            commentCount={item.commentCount}
                            shareCount={item.shareCount}
                            retweetCount={item.retweetCount}
                            isLiked={item.isLiked}
                            key={index}
                        />
                    )
                })}
            </div>
    )
}

export default Main;
