/**
 * pages.config.js - Page routing configuration
 */
import AgentVerification from './pages/AgentVerification';
import Manifesto from './pages/Manifesto';
import Profile from './pages/Profile';
import Square from './pages/Square';
import Thread from './pages/Thread';
import EmbassyCharter from './pages/EmbassyCharter';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AgentVerification": AgentVerification,
    "Manifesto": Manifesto,
    "Profile": Profile,
    "Square": Square,
    "Thread": Thread,
    "EmbassyCharter": EmbassyCharter,
}

export const pagesConfig = {
    mainPage: "Square",
    Pages: PAGES,
    Layout: __Layout,
};
