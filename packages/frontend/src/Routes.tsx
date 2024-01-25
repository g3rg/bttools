import { Route, Routes } from 'react-router-dom'
import Home from './containers/Home.tsx'
import NotFound from './containers/NotFound.tsx'
import Login from './containers/Login.tsx'
import Signup from './containers/Signup.tsx'
import NewNote from './containers/NewNote.tsx'
import Notes from './containers/Notes.tsx'
import UnauthenticatedRoute from './containers/UnuthenticatedRoute.tsx'
import AuthenticatedRoute from './containers/AuthenticatedRoute.tsx'

export default function Links() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/login"
                element={
                    <UnauthenticatedRoute>
                        <Login />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <UnauthenticatedRoute>
                        <Signup />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/notes/new"
                element={
                    <AuthenticatedRoute>
                        <NewNote />
                    </AuthenticatedRoute>
                }
            />

            <Route
                path="/notes/:id"
                element={
                    <AuthenticatedRoute>
                        <Notes />
                    </AuthenticatedRoute>
                }
            />            {/* Finally, catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />;
        </Routes>
    );
}