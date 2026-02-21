"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [page, setPage] = useState("home");
  const [borsa, setBorsa] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [mood, setMood] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const b = localStorage.getItem("borsa");
    const w = localStorage.getItem("wishlist");
    if (b) setBorsa(JSON.parse(b));
    if (w) setWishlist(JSON.parse(w));
  }, []);

  useEffect(() => {
    localStorage.setItem("borsa", JSON.stringify(borsa));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [borsa, wishlist]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function showToast(message) {
    setToast(message);
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setName("");
    setBrand("");
    setDescription("");
    setRating(0);
    setMood(null);
    setImage(null);
  }

  function createProduct() {
    return { id: Date.now(), name, brand, description, rating, mood, image };
  }

  function addToBorsa() {
    if (!name.trim()) return;
    setBorsa([createProduct(), ...borsa]);
    showToast("Il prodotto è stato aggiunto nella borsa 👜");
    resetForm();
  }

  function addToWishlist() {
    if (!name.trim()) return;
    setWishlist([createProduct(), ...wishlist]);
    showToast("Il prodotto è stato aggiunto alla wishlist ☁️");
    resetForm();
  }

  function moveToBorsa(product) {
    setWishlist(wishlist.filter(p => p.id !== product.id));
    setBorsa([product, ...borsa]);
    showToast("Il prodotto è stato spostato nella borsa 👜");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === "borsa") {
      setBorsa(borsa.filter(p => p.id !== deleteTarget.id));
    } else {
      setWishlist(wishlist.filter(p => p.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  }

  function renderStarsInput(value, setter) {
    return (
      <div style={{ marginTop: 10, textAlign: "center" }}>
        {[1,2,3,4,5].map(s => (
          <span
            key={s}
            onClick={() => setter(value === s ? 0 : s)}
            className={value >= s ? "star active" : "star"}
          >★</span>
        ))}
      </div>
    );
  }

  function renderStarsDisplay(r) {
    return (
      <div style={{ textAlign:"center", marginTop:6 }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} className={r>=s?"star active":"star"}>★</span>
        ))}
      </div>
    );
  }

  function renderGrid(products, type) {
    if (products.length === 0) {
      return (
        <div style={{textAlign:"center", marginTop:80}}>
          <div style={{display:"flex", justifyContent:"center", marginBottom:10}}>
            {homeIcon(false)}
          </div>
          <p style={emptyText}>
            Non hai ancora aggiunto nessun prodotto. Vai alla Home per aggiungerne di nuovi.
          </p>
        </div>
      );
    }

    return (
      <div style={grid}>
        {products.map(p => (
          <div key={p.id} style={productCard} className="card-hover">
            <div style={{ position:"relative" }}>
              {p.image && <img src={p.image} style={gridImage} />}
              <button
                style={deleteBtn}
                onClick={(e)=>{ e.stopPropagation(); setDeleteTarget({ id:p.id, type }); }}
              >{betterTrashIcon}</button>
              {type === "wishlist" && (
                <button
                  style={buyBtn}
                  onClick={(e)=>{ e.stopPropagation(); moveToBorsa(p); }}
                >💲</button>
              )}
            </div>

            <div style={{ textAlign:"center", marginTop:8 }}>
              <strong style={{ display:"block" }}>{p.name}</strong>
              <span style={{ display:"block", opacity:0.7 }}>{p.brand}</span>
            </div>

            <div style={{ textAlign:"center", marginTop:6 }}>
              {p.mood==="happy"?"🤩":p.mood==="sad"?"😭":""}
            </div>

            {renderStarsDisplay(p.rating)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={wrapper}>

      {page === "home" && (
        <>
          <h1 style={title}>AGGIUNGI PRODOTTI</h1>

          <div style={card} className="card-soft">

            <input placeholder="Nome prodotto" value={name} onChange={e => setName(e.target.value.toUpperCase())} style={input}/>
            <input placeholder="Marca prodotto" value={brand} onChange={e => setBrand(e.target.value)} style={input}/>

            <div style={{ marginBottom:15 }}>
              {!image ? (
                <label style={cameraBox} className="tap">
                  {cameraIcon}
                  <input type="file" accept="image/*" onChange={handleImage} hidden />
                </label>
              ) : (
                <img src={image} style={previewImage} />
              )}
            </div>

            <div style={{ display:"flex", gap:12 }}>
              <textarea placeholder="Descrizione" value={description} onChange={e => setDescription(e.target.value)} style={{ ...input, flex:1, height:120, marginBottom:0 }}/>
              <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", height:120 }}>
                <button onClick={()=>setMood(mood==="happy"?null:"happy")} className={mood==="happy"?"mood happy active tap":"mood happy tap"}>{mood==="happy"?"🤩":"😊"}</button>
                <button onClick={()=>setMood(mood==="sad"?null:"sad")} className={mood==="sad"?"mood sad active tap":"mood sad tap"}>{mood==="sad"?"😭":"😢"}</button>
              </div>
            </div>

            {renderStarsInput(rating, setRating)}

            <button style={addBtn} onClick={addToBorsa} className="tap">＋</button>
            <button style={wishlistBtn} onClick={addToWishlist} className="tap">{cloudIcon(false)}</button>
          </div>

          <button style={infoBtn} onClick={()=>setShowInfo(true)} className="tap">Come Funziona ℹ️</button>
        </>
      )}

      {page === "wishlist" && (<><h1 style={title}>LISTA DEI DESIDERI</h1>{renderGrid(wishlist,"wishlist")}</>)}
      {page === "borsa" && (<><h1 style={title}>BORSA</h1>{renderGrid(borsa,"borsa")}</>)}

      {deleteTarget && (
        <div style={modalOverlay}>
          <div style={modal} className="modal-anim">
            <h3>Vuoi davvero eliminarlo?</h3>
            <div style={{ display:"flex", justifyContent:"space-around", marginTop:15 }}>
              <button style={cancelBtn} onClick={()=>setDeleteTarget(null)} className="tap">Ripensaci</button>
              <button style={confirmBtn} onClick={confirmDelete} className="tap">Elimina</button>
            </div>
          </div>
        </div>
      )}

      {toast && (<div style={toastStyle} className="toast-anim">{toast}</div>)}

      {showInfo && (
        <div style={modalOverlay}>
          <div style={modal} className="modal-anim">
            <h2 style={{marginBottom:15}}>Come funziona l'app</h2>
            <div style={infoSection}><div style={infoEmoji}>📝</div><div><strong>1. Inserisci</strong><p>Aggiungi nome, marca, foto e descrizione del prodotto.</p></div></div>
            <div style={infoSection}><div style={infoEmoji}>⭐</div><div><strong>2. Valuta</strong><p>Dai un voto da 0 a 5 stelle e indica se ti piace.</p></div></div>
            <div style={infoSection}><div style={infoEmoji}>👜</div><div><strong>3. Organizza</strong><p>Salva nella borsa o nella wishlist e tieni tutto sotto controllo.</p></div></div>
            <button style={confirmBtn} onClick={()=>setShowInfo(false)} className="tap">Chiudi</button>
          </div>
        </div>
      )}

      <div style={bottomNav}>
        <button style={navBtn} onClick={()=>setPage("wishlist")} className="tap">{cloudIcon(page==="wishlist")}</button>
        <button style={navBtn} onClick={()=>setPage("home")} className="tap">{homeIcon(page==="home")}</button>
        <button style={navBtn} onClick={()=>setPage("borsa")} className="tap">{bagIcon(page==="borsa")}</button>
      </div>

      <style>{`
        .tap { transition: transform .1s ease, filter .1s ease; }
        .tap:active { transform: scale(.85); filter: brightness(.85); }

        .card-soft { box-shadow: 0 15px 40px rgba(0,0,0,0.12); }
        .card-hover { box-shadow: 0 12px 35px rgba(0,0,0,0.12); transition: transform .2s ease, box-shadow .2s ease; }
        .card-hover:active { transform: scale(.95); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }

        .modal-anim { animation: pop .25s ease; }
        @keyframes pop { from { transform: scale(.85); opacity:0;} to { transform: scale(1); opacity:1;} }

        .toast-anim { animation: fadeUp .3s ease; }
        @keyframes fadeUp { from { opacity:0; transform: translate(-50%,25px);} to { opacity:1; transform: translate(-50%,0);} }

        .mood { width:50px;height:50px;border-radius:15px;border:none;font-size:22px;background:#eee;cursor:pointer;transition:all .3s ease; }
        .mood.happy.active {background:#22c55e;color:white;transform:scale(1.2);} 
        .mood.sad.active {background:#ef4444;color:white;transform:scale(1.2);} 

        .star { cursor:pointer;font-size:22px;color:#ccc;transition:all .2s ease;display:inline-block;margin:0 2px; }
        .star.active { color:#f59e0b; transform:scale(1.5); }
      `}</style>
    </div>
  );
}

const homeIcon=(active)=> (<svg width="26" height="26" fill="none" stroke={active?"#d97706":"black"} strokeWidth="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>);
const bagIcon=(active)=> (<svg width="26" height="26" fill="none" stroke={active?"#d97706":"black"} strokeWidth="2"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7V5a3 3 0 016 0v2"/></svg>);
const cloudIcon=(active)=> (<svg width="26" height="26" fill="none" stroke={active?"#d97706":"black"} strokeWidth="2"><path d="M20 17.5a4.5 4.5 0 00-1.3-8.8A5.5 5.5 0 005 10.5 3.5 3.5 0 005.5 17.5H20z"/></svg>);
const cameraIcon=(<svg width="30" height="30" fill="none" stroke="#999" strokeWidth="2"><rect x="3" y="7" width="24" height="16" rx="3"/><circle cx="15" cy="15" r="5"/></svg>);
const betterTrashIcon=(<svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h12"/><path d="M6 6v10"/><path d="M12 6v10"/><path d="M5 6l1 12h8l1-12"/><path d="M8 6V4h4v2"/></svg>);

const wrapper={minHeight:"100vh",padding:"20px 20px 100px",background:"#f5efe6"};
const title={fontSize:32,fontWeight:"bold",textAlign:"center",marginBottom:20};
const card={background:"white",padding:22,borderRadius:22,marginBottom:15};
const input={width:"100%",padding:12,borderRadius:12,border:"1px solid #ddd",marginBottom:12};
const addBtn={width:"100%",height:70,borderRadius:18,border:"none",background:"#d97706",color:"white",fontSize:36,fontWeight:"bold",marginTop:15,cursor:"pointer",boxShadow:"0 10px 25px rgba(217,119,6,0.4)"};
const wishlistBtn={width:"100%",marginTop:10,height:70,borderRadius:18,border:"none",background:"#eee",cursor:"pointer",boxShadow:"0 8px 20px rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center"};
const cameraBox={width:"100%",height:130,border:"2px dashed #ccc",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"};
const previewImage={width:"100%",height:130,objectFit:"contain",background:"#f3f3f3",borderRadius:18,marginBottom:10};

const grid={display:"grid",gridTemplateColumns:"1fr 1fr",gap:16};
const productCard={background:"white",padding:14,borderRadius:20};
const gridImage={width:"100%",height:160,objectFit:"contain",background:"#f3f3f3",borderRadius:16};
const deleteBtn={position:"absolute",top:8,right:8,background:"white",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 10px rgba(0,0,0,0.1)"};
const buyBtn={position:"absolute",top:8,left:8,background:"white",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,0.1)"};

const bottomNav={position:"fixed",bottom:0,left:0,right:0,height:80,background:"white",display:"flex",justifyContent:"space-around",alignItems:"center",boxShadow:"0 -8px 25px rgba(0,0,0,0.08)"};
const navBtn={background:"none",border:"none",cursor:"pointer"};

const emptyText={fontSize:16,lineHeight:1.6};

const modalOverlay={position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center"};
const modal={background:"white",padding:28,borderRadius:24,width:"90%",maxWidth:420,textAlign:"center",boxShadow:"0 25px 60px rgba(0,0,0,0.25)"};
const cancelBtn={padding:12,borderRadius:12,border:"1px solid #ccc",background:"white",cursor:"pointer"};
const confirmBtn={padding:12,borderRadius:12,border:"none",background:"#d97706",color:"white",cursor:"pointer",marginTop:10,boxShadow:"0 8px 20px rgba(217,119,6,0.4)"};

const toastStyle={position:"fixed",bottom:110,left:"50%",transform:"translateX(-50%)",background:"#111",color:"white",padding:"14px 24px",borderRadius:25,fontSize:15,opacity:0.97,boxShadow:"0 15px 35px rgba(0,0,0,0.35)"};

const infoBtn={width:"100%",marginTop:20,height:60,borderRadius:20,border:"none",background:"#111",color:"white",fontWeight:"bold",cursor:"pointer",boxShadow:"0 12px 30px rgba(0,0,0,0.2)"};

const infoSection={display:"flex",gap:14,alignItems:"flex-start",marginBottom:18,textAlign:"left"};
const infoEmoji={fontSize:26};
