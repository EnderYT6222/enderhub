window.addEventListener('DOMContentLoaded', () => {

    const supabaseUrl = "https://YOUR-PROJECT.supabase.co";
    const supabaseKey = "YOUR-ANON-KEY";
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // UI Elements
    const messagesDiv = document.getElementById("messages");
    const msgInput = document.getElementById("msgInput");
    const sendBtn = document.getElementById("sendBtn");

    let userId = "user-" + Math.floor(Math.random()*10000);

    // Send message
    sendBtn.onclick = async () => {
        const text = msgInput.value.trim();
        if(!text) return;
        const { error } = await supabase.from("messages").insert([{ user_id: userId, content: text }]);
        if(error) console.error(error);
        msgInput.value = "";
    };

    // Realtime listener
    supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        const el = document.createElement("div");
        el.textContent = `${msg.user_id}: ${msg.content}`;
        messagesDiv.appendChild(el);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      })
      .subscribe();

    // Load last 50 messages
    async function loadMessages() {
        const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: true }).limit(50);
        if(error) console.error(error);
        data.forEach(msg => {
            const el = document.createElement("div");
            el.textContent = `${msg.user_id}: ${msg.content}`;
            messagesDiv.appendChild(el);
        });
    }
    loadMessages();
});
