import { SOCKET } from '../components/socket';
import GenreBox from '../components/genreBox';
import cassette from '../images/cassette_svg.svg'

function HomePage()
    {

        return (
            <div className="grid grid-cols-3 gap-4 mx-12">

                <div className="col-start-1 col-span-3 bg-cyan-500 rounded-b-lg p-4 h-[calc(60vh-65px)]">
                    
                </div>       

                <GenreBox Genre={ "Genre #1" }/>
                <GenreBox Genre={ "Genre #2" }/>
                <GenreBox Genre={ "Genre #3" }/>
                <GenreBox Genre={ "Genre #4" }/>
                <GenreBox Genre={ "Genre #5" }/>
                <GenreBox Genre={ "Genre #6" }/>

            </div>
        )
    }

export default HomePage;