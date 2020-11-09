import React from "react";
import { useHistory } from "react-router-dom";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import "./style/Carousel.scss";

export default function Carousel() {
  const history = useHistory();
  const content = [
    {
      title: "Samuel N.",
      role: "Joueur",
      description:
        "Sur Lan'U.R , je peux suivre tous mes joueurs préférés et mieux comprendre le fonctionnement d'une team pro.",
      image:
        "http://www.influencia.net/data/classes/actualite/actu_6082_image2012rectangle_petite.png"
    },
    {
      title: "John C.",
      role: "Joueur Professionnel",
      description:
        "J'adore Lan'U.R!  Ce réseau me permet de rencontrer d'autres joueurs et de m'entraîner pour passer pro.",
      image:
        "http://www.influencia.net/data/classes/actualite/actu_6082_image2012rectangle_petite.png"
    },
    {
      title: "Harry D.",
      role: "Coach",
      description:
        "Grâce à LAN'U.R j'ai pu rencontrer des joueurs ayant les capacités de devenir professionnel. J'ai pu les accompagner pour rejoindre ma team.",
      image:
        "http://www.influencia.net/data/classes/actualite/actu_6082_image2012rectangle_petite.png"
    },
    {
      title: "Robert Valles",
      role: "Manager de Team",
      description:
        "J'utilise Lan'U.R pour être au courant de tous les événements et les résultats des compétitions d'esport.",
      image:
        "http://www.influencia.net/data/classes/actualite/actu_6082_image2012rectangle_petite.png"
    }
  ];
  return (
    <div>
      <Slider autoplay={5000} className="slider" previousButton nextButton>
        {content.map((item, index) => (
          <div
            key={index}
            style={{
              background: `url('${item.image}') no-repeat center`,
              backgroundSize: "cover"
            }}
          >
            <div className="center">
              <div className="content">
                <h2>{item.title}</h2>
                <h3>{item.role}</h3>
                <p>
                  <span className="quotes">"</span>
                  {item.description}
                  <span className="quotes">"</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div
        className="passer"
        onClick={() => {
          history.push("/SignIn");
        }}
      >
        {" "}
        Passer{" "}
      </div>
    </div>
  );
}
