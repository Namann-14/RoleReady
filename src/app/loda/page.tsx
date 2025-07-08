import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <div className="absolute inset-0 -z-10 w-full h-full">
            {/* <iframe
                src="https://my.spline.design/reactivebackground11-CiNmZtQVNZB0wZdxiikGHYDg/"
                className="w-full h-full"
                allowFullScreen
            ></iframe> */}
            <iframe src='https://my.spline.design/worldplanet-f0PEjiO2lyA98Gb4iFm5Dn1a/' 
                width='100%' 
                height='100%'
            ></iframe>
        </div>
    )
}

export default page