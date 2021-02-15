import React, { useState, useEffect } from 'react';
import './App.css'
import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'


export default () => {

    const [movieList, setMovieList] = useState([])
    const [featuredData, setFeaturedData] = useState(null)
    const [blackHeader, setBlackHeader] = useState(false)

    useEffect(() => {
        const loadAll = async () => {
            //pegando a lista total
            let list = await Tmdb.getHomeList()
            setMovieList(list)

            //pegando filme em destaque
            let originals = list.filter(i => i.slug === 'originals')
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
            let chosen = originals[0].items.results[randomChosen]
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
            setFeaturedData(chosenInfo)
        }

        loadAll()
    }, [])

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 20) {
                setBlackHeader(true)
            } else {
                setBlackHeader(false)
            }
        }

        window.addEventListener('scroll', scrollListener)
        return () => {
            window.removeEventListener('scroll', scrollListener)
        }
    }, [])

    return (
        <div className="page">

            <Header black={blackHeader} />

            {featuredData &&
                <FeaturedMovie item={featuredData} />
            }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow
                        key={key}
                        title={item.title}
                        items={item.items}
                    />
                ))}
            </section>
            <footer>
                Feito com <span role="img" arial-aria-label="coração">❤️</span> por <a href="http://github.com/viniciuscbb" target="_blank" rel="noopener noreferrer">Vinícius Nunes</a><br />
                Direitos de imagem para Netflix<br />
                Dados obtidos pelo site TheMovieDb.org
            </footer>

            {movieList.length <= 0 &&
                <div className="loading">
                    <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/Netflix_LoadTime-scaled-692x376.gif" alt="Carregando" />
                </div>
            }
        </div>
    )
}