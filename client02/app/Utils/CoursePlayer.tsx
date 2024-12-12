import React, { FC, useEffect, useState } from 'react'
import axios from 'axios';

type Props = {
    videoUrl: string;
    title: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
    const [videoData, setVideoData] = useState({
        otp: "",
        playbackInfo: "",
    });
    console.log("Video Url: " , videoUrl);
    
    useEffect(() => {
        // if (videoUrl.includes("localhost:8000")) {
        //     axios.post("http://localhost:8000/api/v1/getVdoCipherOTP", {
        //         videoId: videoUrl,
        //     }).then((res) => {
        //         console.log("Ress" ,res.data);

        //         setVideoData(res.data);
        //     });
        // }
    }, [videoUrl]);
    
    // Kiểm tra nếu videoUrl là của Cloudinary hay của VdoCipher
    const isCloudinaryVideo = videoUrl.includes('res.cloudinary.com');

    return (
        <div style={{ paddingTop: "41%", position: "relative" }}>
                <video
    key={videoUrl} // Thêm key để buộc component render lại
    controls
    style={{
        width: "80%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    }}
>
    <source src={videoUrl} type="video/mp4" />
    Your browser does not support the video tag.
</video>
        </div>
    );
}

export default CoursePlayer;
