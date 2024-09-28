import { useRef, useState } from 'react';
import { CrossIcon } from '../../svg/Cross'
import { UploadIcon } from '../../svg/Upload'
import ImageCropper from '../ImageCropper';
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, updateProfile } from 'firebase/auth';
import { loggedInUser } from '../../fetures/slice/LoginSlice';
const Modals = ({setShow}) => {
    const user = useSelector(user => user.login.loggedIn);
    const auth = getAuth();
    const inputRef = useRef(null);
    const [image, setImage] = useState();
    const [cropData, setCropData] = useState("#");
    const cropperRef = useRef();
    const storage = getStorage();
    const storageRef = ref(storage, user.uid);
    const dispatch = useDispatch();
    const handelChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    }
    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
          setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
          const data = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            uploadString(storageRef, data, 'data_url').then((snapshot) => {
                getDownloadURL(storageRef).then((downloadURL) => {
                    updateProfile(auth.currentUser, {
                         photoURL: downloadURL
                      }).then(() => {
                        dispatch(loggedInUser({...user, photoURL: downloadURL}));
                        localStorage.setItem("user", JSON.stringify({...user, photoURL: downloadURL}));
                        setShow(false);
                      }).catch((error) => {
                        console.log(error);
                      });
                });
            });
        }
    };
  return (
    <>
    <div className='fixed top-0 left-0 w-full h-screen bg-[#2e2e2ef0] flex justify-center items-center'>
        <div className='w-[30%] rounded-md bg-white p-4 relative'>
            <div className='w-full'>
                <h3 className='text-center text-base font-fontBold text-[#2e2e2e]'>Upload Photo</h3>
                <div className='absolute top-2 right-2 cursor-pointer' onClick={() => setShow(false)}>
                    <CrossIcon />
                </div>
            </div>
            <div className='w-full border border-slate-400 rounded-md h-[300px] mt-5 p-2 box-border' onClick={() => inputRef.current.click()}>
                <div className='p-5 bg-[#f9f9f9] rounded-md p-4 w-full h-full flex justify-center items-center cursor-pointer flex-col gap-2'>
                    <div>
                        <UploadIcon />
                    </div>
                    <h4 className='text-base font-fontSemiBold text-[#2e2e2e]'>Upload Your Photo</h4>
                    <input className='hidden' type="file" ref={inputRef} onChange={handelChange} />
                </div>
            </div>
           
        </div>
    </div>
     {image && (
        <div className='w-full mt-5'>
            <ImageCropper image={image} setImage={setImage} cropperRef={cropperRef} getCropData={getCropData} />
        </div>
    )}
    </>
  )
}

export default Modals