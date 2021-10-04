const CLIENT_ID = process.env.TWITCH_CLIENT_ID ?? "INVALID_CLIENT_ID";
const REDIRECT_URI = process.env.TWITCH_REDIRECT_URI ?? "https://localhost:3000";

const TWITCH_SCOPE = {
    manageBlocklist: "user:manage:blocked_users",
};

const LOGIN_HREF = new URL("https://id.twitch.tv/oauth2/authorize");
LOGIN_HREF.searchParams.set("client_id", CLIENT_ID);
LOGIN_HREF.searchParams.set("redirect_uri", REDIRECT_URI);
LOGIN_HREF.searchParams.set("response_type", "token");
LOGIN_HREF.searchParams.set("scope", [TWITCH_SCOPE.manageBlocklist].join(" "));

export default function TwitchPage() {
    return (
        <div>
            <a href={LOGIN_HREF.toString()}>Login</a>
        </div>
    );
}
