import { useEup, COLORS, RPC_ENDPOINT } from "eternal-users-protocol";
import { useState } from "react";
import { Edit, Upload } from "lucide-react";
import { useRef } from 'react';

export function Profile()  {
    const [ editing, setEditing ] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    console.log({RPC_ENDPOINT})

    const eup = useEup();

    const image = editing ? (eup.draft.image || eup.user.image) : eup.user.image;
    const color = editing ? eup.draft.color || eup.user.color : eup.user.color || "green";
    const loading = eup.state === "fetching" || !eup.state || !eup.user.id;

    return (
        <div className="w-full max-w-xl mx-auto relative">
            {eup.state === "fetching" || !eup.state || !eup.user.id ? (
                 <div className="shadow rounded">
                    <div className="h-[10rem]"></div>
                    <div className="aspect-square rounded-full max-w-[15rem] w-full bg-gray-800 mx-auto shadow-lg -translate-y-1/2 -mb-24 animate-pulse"></div>
                    <div className="p-5">
                        <div className="animate-pulse h-6 w-1/2 bg-gray-800 rounded mb-2"></div>
                        <div className="animate-pulse h-4 w-full bg-gray-800 rounded mb-2"></div>
                        <div className="animate-pulse h-4 w-full bg-gray-800 rounded mb-2"></div>
                        <div className="animate-pulse h-4 w-full bg-gray-800 rounded mb-2"></div>
                    </div>
                 </div>
            ) : (
                <div className={`shadow rounded-xl border overflow-hidden ${loading ? "ponter-events-none opacity-50" : ""}`}>
                    <div className={`bg-gradient-to-t color-${color} h-[10rem]`}></div>
                    <div className="relative max-w-[15rem] mx-auto -translate-y-1/2 -mb-32">
                        <img src={image} alt="" className="aspect-square rounded-full shadow-lg w-full"/>

                        {editing && (
                            <button className="btn btn-secondary rounded-full absolute aspect-square right-2 top-2" onClick={() => fileInputRef?.current?.click()}>
                                <Upload size={18} className=""/>
                            </button>
                        )}
                    </div>
                    <div className="p-5">
                        {
                            editing ?
                            (   <>  
                                    <p className="text-xs mb-1">Theme</p>
                                    <div className="flex gap-2 mb-4">
                                        {COLORS.map((color) => {
                                            return (
                                                <button key={color} className={`bg-gradient-to-t rounded-full w-6 h-6 color-${color} ${color === eup.draft.color ? "border-2 !border-white" : ""}`} onClick={() => eup.set.color(color)}></button>
                                            )
                                        })}
                                    </div>
                                    <input type="file" className="hidden" onChange={eup.input.image} ref={fileInputRef} />
                                    <p className="text-xs mb-1">Name</p>
                                    <input type="text" className="input input-text input-bordered mb-3 w-full" placeholder="" onChange={eup.input.name} value={eup.draft.name}/>
                                    <div className="flex justify-between">
                                        <p className="text-xs mb-1">Description</p>
                                        <p className="text-xs mb-1">{eup.draft.description?.length} / 200</p>
                                    </div>
                                    <textarea rows={3} maxLength={200} className="textarea text-[1rem] input-bordered w-full min-h-2xl mb-2" placeholder="" onChange={eup.input.description} value={eup.draft.description}></textarea>

                                    <p className="text-xs mb-1">Twitter</p>
                                    <input type="text" className="input input-text input-bordered mb-3 w-full" onChange={eup.input.twitter} value={eup.draft.twitter}/>
                                    <p className="text-xs mb-1">Discord</p>
                                    <input type="text" className="input input-text input-bordered mb-3 w-full" onChange={eup.input.discord} value={eup.draft.discord}/>
                                    <p className="text-xs mb-1">Telegram</p>
                                    <input type="text" className="input input-text input-bordered mb-3 w-full" onChange={eup.input.telegram} value={eup.draft.telegram}/>
                                    <p className="text-xs mb-1">Website</p>
                                    <input type="text" className="input input-text input-bordered mb-3 w-full" onChange={eup.input.website} value={eup.draft.website}/>
                                    

                                    {eup.state === "uploading" ? (
                                        <button className="btn btn-secondary pointer-events-none">
                                            Uploading metadata...
                                        </button>
                                    ) : eup.state === "updating" ? (
                                        <button className="btn btn-secondary pointer-events-none">
                                            Uploading metadata...
                                        </button>
                                    ) : (
                                        <div className="flex my-3 gap-3">
                                            <button className="btn btn-secondary w-1/4" onClick={() => setEditing(false)}>
                                                Cancel
                                            </button>
                                            <button className="btn btn-accent grow" onClick={eup.save}>
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button className="absolute right-5 top-5" onClick={() => (setEditing(true))}>
                                        <Edit size={24} />
                                    </button>
                                    <h2 className="text-4xl font-semibold">{eup.user.name}</h2>
                                    <p>{eup.user.description}</p>
                                    <div className="">
                                        <p className="font-semibold">Links</p>
                                    </div>
                                </>
                            )
                        }
                    </div>

                </div>
            )}
        </div>
    );
}