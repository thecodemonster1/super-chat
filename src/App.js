import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

firebase.initializeApp(){
	apiKey: "AIzaSyB63eYgkCs6kj0O-WYZug5MpFZGvJgeGKM",
	authDomain: "monsterchat777.firebaseapp.com",
	projectId: "monsterchat777",
	storageBucket: "monsterchat777.appspot.com",
	messagingSenderId: "89107307349",
	appId: "1:89107307349:web:7d75def990ae13132b2ddc",
	measurementId: "G-CZXNVPPZPW"
}

const auth = firebase.auth();
const firestore = firebase.firestore();

const [user] = useAuthState(auth);

function App() {
	return (
		<div className="App">
			<header className="App-header">
			</header>
			
			<section>
				{user ? <ChatRoom /> : <SignIn />} 
			</section>
		</div>
	);
}

function SignIn(){

	const SignInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	}


	return (
		<button onclick={SignInWithGoogle}>Sign in with Google</button>
	)
}

function SignOut(){
	return auth.currentUser && (
		<button onclick={() => auth.signOut()}>Sign Out</button>
	)
}

function ChatRoom(){

	const dummy = useRef();
	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit (25) ;
	const [messages] = useCollectionData(query, {idField: 'id'});

	const [formValue, setFormValue] = useState(''); 

	const sendMessage = async(e) => {
		e.preventDefault();

		const {uid, photoURL} = auth.currentUser;

		await messageRef.add({
			text: formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid, 
			photoURL
		});

		setFormValue('');

		dummy.current.scrollIntoView({ behavior: 'smooth' });
	}
	
	return (
		<>
			<main>
				{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg})}

				<div ref={dummy}></div>
			</main>

			<form onSubmit={sendMessage}>
				<input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
				
				<button type="submit">🌕</button>
			</form>
		</>
	)
}

function ChatMessage(props){
	const { text, uid, photoURL} = props.message;


	const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

	
	return (
		<div className={` message${messageClass}`}>
			<img src={photoURL} />
			<p>{text}</p>
		</div>
	)
}

export default App;
