import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import axios from 'axios';
interface Banner {
    id?: string | undefined,
    tittle?: string,
    message?: string
}

const GeneralNotify: React.FC = () => {
    const [notify, setNotify] = useState<Banner[]>([
        { id: undefined, tittle: '', message: '' },
    ]);
    const [notifyList, setNotifyList] = useState<any[]>([]);


    const api = axios.create({
        baseURL: 'http://localhost:4000/api',
    });

    useEffect(() => {
        getAllNotification();
    }, []);

    useEffect(() => {
        console.log("notify", notify);
    }, [notify]);

    const handleChange = (index: number, key: string, value: string) => {
        const updated = [...notify];
        //    (updated[index] as any)[key] = value
        updated[index] = { ...updated[index], [key]: value }; // from above line and this one any one can be done
        setNotify(updated)
    };


    const handleNotification = async () => {
        try {

            const payload = notify[0]

            console.log("payload", payload);
            const response: any = await api.post('/send-notify', { data: payload });

            if (response.status === 200) {
                alert(`Notification sent successfully`);
                getAllNotification();
                setNotify([{ id: undefined, tittle: '', message: '' }]);
                console.log("response", notify);
            }

        } catch (error) {
            console.error(error);
        }
    };
    const token = localStorage.getItem("token");
    console.log("token", token);

    const getAllNotification = async () => {
        try {
            const res: any = await api.get('/get-all-notify', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("res", res.data.data);
            if (res.status === 200) setNotifyList(res.data.data);

            if (res.status === 401) {
                alert("Session expired, please login again");
                localStorage.removeItem("token");
                window.location.href = "/auth";
            }
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        console.log("notifyList", notifyList);
    }, [notifyList]);

    return (
        <div className="flex h-screen w-full bg-[#FFFFFF]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Navbar />
                <div className="p-10 space-y-8">
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Tittle for Notification"
                            value={notify[0].tittle}
                            onChange={(e) => handleChange(0, 'tittle', e.target.value)}
                            className="border px-3 py-2 rounded w-1/2"
                        />
                        <input
                            type="text"
                            placeholder="Add message for Notification"
                            value={notify[0].message}
                            onChange={(e) => handleChange(0, 'message', e.target.value)}
                            className="border px-3 py-2 rounded w-1/2"
                        />
                    </div>

                    {/* {!isEditMode && (
            <button
              onClick={addNewBanner}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus size={18} /> Add Offer
            </button>
          )} */}

                    <button
                        onClick={() => handleNotification()}
                        className="bg-blue-600 text-white w-full py-2 mt-6 rounded-xl hover:bg-blue-700"
                    >
                        Send Notification
                    </button>
                </div>

                {/* Banner List */}
                <div className="grid grid-cols-2 gap-6 p-6">
                    {notifyList.map((notify: any) => (
                        <div>

                            <div key={notify._id} className="border p-4 rounded-lg shadow-sm space-y-4 bg-slate-300 flex flex-col gap-2">
                                <span className="font-bold text-gray-800">Tittle:</span> {notify.tittle}
                                <span className="font-bold text-gray-800">Message Sent in the notification:</span> {notify.message}
                            </div>

                        </div>

                    ))}
                </div>
            </div>
        </div >
    );
};

export default GeneralNotify;
