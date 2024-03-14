import { useEup, COLORS, RPC_ENDPOINT } from "eternal-users-protocol";
import { useEffect, useState } from "react";
import { Edit, ExternalLink, Info, Loader2, Upload } from "lucide-react";
import { useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useParams } from 'react-router-dom';

const LINK_METADATA: Record<string, {
    name: string,
    icon: string,
    prefix?: string
}> = {
    twitter: {
        name: "Twitter",
        icon: "/x-logo.svg",
        prefix: "https://twitter.com/"
    },
    discord: {
        name: "Discord",
        icon: "/discord-logo.svg",
    },
    telegram: {
        name: "Telegram",
        icon: "/telegram-logo.svg",
    },
    website: {
        name: "Website",
        icon: "/globe.svg",
        prefix: ""
    }
}

type LINK = keyof typeof LINK_METADATA;

function LinkCard(props: {type: LINK, value: string}) {
    let trimmed = props.value?.replace("@", "");

    const link = LINK_METADATA[props?.type];

    return (
        <a href={link?.prefix ? link?.prefix + trimmed : ""} className={`btn btn-secondary w-full flex justify-between ${link?.prefix !== undefined ? "" : "pointer-events-none"}`}>
            <div className="flex items-center gap-3">
                <img src={link?.icon} className="h-4 aspect-square" alt="" />
                {trimmed}
            </div>
            
            {link?.prefix !== undefined && (
                <div>
                    <ExternalLink size={18} />
                </div>
            )}
        </a>
    )
}

function Loader() {
    return (
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
    )
}

export function Profile()  {
    const [ editing, setEditing ] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const wallet = useWallet();

    let { id: userId } = useParams();

    const eup = useEup();

    const image = editing ? (eup.draft.image || eup.user.image) : eup.user.image;
    const color = editing ? eup.draft.color || eup.user.color : eup.user.color || "green";
    const isOwner = wallet?.publicKey?.toBase58() === userId;
    const firstTime = isOwner && eup.state === "resting" && !eup.user.id && wallet.connected;
    const isNew = eup.state === "resting" && !eup.user.id;
    const loading = eup.state === "fetching";
    const updating = eup.state === "updating" || eup.state === "uploading";

    useEffect(() => {
        if(firstTime) {
            setEditing(true);
        } else if(eup.state === "resting" && !eup.user.id){
            setEditing(false);
        }
    }, [firstTime]);

    useEffect(() => {
        window.scrollTo(0, 0);
    })

    return (
        <div className="w-full max-w-xl mx-auto relative min-h-screen">
            {loading ? (
                <Loader />
            ) : (
                <>
                {isNew && !editing && (
                    <div role="alert" className="alert">
                        <Info size={18} className="mr-2"/>
                        <span>This profile isn't setup yet. If you own this public key, conncet wallet to edit.</span>
                    </div>
                )}
                {editing && (
                    <>
                        <h2 className="text-3xl font-semibold">
                            Edit Profile
                        </h2>
                        <p className="mb-3 opacity-50">{userId}</p>
                    </>
                )}
                <div className={`shadow rounded-xl border overflow-hidden ${updating ? "pointer-events-none opacity-30" : ""}`}>
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
                                    <p className="teDiBRPe3LBFTQs8WmDqyMqDW91F2XpAbAqeGJkrE8J2KHxt-xs mb-1 text-xs">Theme</p>
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
                                    
                                    <div className="relative">
                                        {eup.state === "uploading" ? (
                                            <div className="border rounded pointer-events-none w-full p-3 flex gap-3">
                                            <Loader2 size={24} className="animate-spin"/>
                                            Uploading metadata...
                                        </div>
                                        ) : eup.state === "updating" ? (
                                            <div className="border rounded pointer-events-none w-full p-3 flex gap-3">
                                                <Loader2 size={24} className="animate-spin"/>
                                                Updating NFT...
                                            </div>
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
                                    </div>
                                </>
                            ) : (
                                <>  
                                    {isOwner && (
                                        <button className="absolute right-5 top-5" onClick={() => (setEditing(true))}>
                                            <Edit size={24} />
                                        </button>
                                    )}
                                    <h2 className="text-4xl font-semibold">{eup.user.name}</h2>

                                    <p>{eup.user.description}</p>

                                    {eup.user.twitter || eup.user.discord || eup.user.telegram || eup.user.website ? (
                                        <>
                                            <div className="flex flex-col gap-3 my-3">
                                                {eup.user.twitter && (
                                                    <LinkCard type="twitter" value={eup.user.twitter} />
                                                )}
                                                {eup.user.website && (
                                                    <LinkCard type="website" value={eup.user.website} />
                                                )}
                                                {eup.user.discord && (
                                                    <LinkCard type="discord" value={eup.user.discord} />
                                                )}
                                                {eup.user.telegram && (
                                                    <LinkCard type="telegram" value={eup.user.telegram} />
                                                )}
                                            </div>
                                        </>
                                    ): null}
                                </>
                            )
                        }
                    </div>
                </div>
                </>
            )}
        </div>
    );
}