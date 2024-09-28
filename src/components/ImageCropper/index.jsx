import { CrossIcon } from "../../svg/Cross"
import Cropper from "react-cropper";

const ImageCropper = ({image, setImage, cropperRef, getCropData }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-screen flex justify-center items-center'>
        <div className='w-[30%] rounded-md bg-white p-4 relative'>
            <div className='w-full'>
                <h3 className='text-center text-base font-fontBold text-[#2e2e2e]'>Upload Photo</h3>
                <div className='absolute top-2 right-2 cursor-pointer' onClick={() => setImage()}>
                    <CrossIcon />
                </div>
            </div>
            <div>
            <div className="w-20 h-20 m-auto rounded-full overflow-hidden mb-5">
                <div className="img-preview" style={{ width: "100%", float: "left", height: "300px" }}/></div>
            </div>
            <div>
            <Cropper
                ref={cropperRef}
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
                />
            </div>
            <button onClick={getCropData} className="w-full mt-4 bg-[#6C5DD3] text-white py-2 mt-3 rounded-md">Upload</button>
        </div>
    </div>
  )
}

export default ImageCropper