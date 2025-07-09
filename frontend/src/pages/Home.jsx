import { Link } from 'react-router-dom'
import MainNavBar from '../components/MainNavBar'
import logo from '../../public/logo.jpg'
import rayen from '../assets/rayen.jpg'

export default function Home() {
  return (
    <>
      <MainNavBar />
      <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
        <div className="md:flex">
          <div className="md:shrink-0">
            <img className=" w-full object-cover md:h-full md:w-48" src={logo}/>
          </div>
          <div className="p-8">
            <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">Uh Gina delivery</div>
            <p className="mt-2 text-gray-500">
              Ici nous faisons vos courses et assurons la livraison à domicile rapidement. 🛒📦
              N'hésitez pas à nous contacter sur  51 146 067 ☎️
              📍Ville de Kasserine
            </p>
            <div className="text-end mt-6">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded hover:bg-indigo-600">
                Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <p className="mt-2 text-gray-500">
              Oh, Gina Delivery vous facilite la vie : repas, courses, médicaments, et bien plus à domicile ! <br />
              Depuis n’importe quel resto ou commerce de Kasserine, on vous livre vite et frais <br />
              Même pour vos documents ou besoins urgents, on assure un service rapide et fiable ! <br />
              Contactez-nous au 51 146 067 – Commandez, on s’occupe du reste ! 
            </p>
            <div className="text-start mt-6">
              <a href="https://www.facebook.com/profile.php?id=61576288833815" target='_blank' className="px-4 py-2 mr-5 text-sm font-semibold text-white bg-indigo-800 rounded hover:bg-indigo-600">Facebook →</a>
              <a href="https://www.instagram.com/uhgina_delivery/" target='_blank' className="px-4 py-2 text-sm font-semibold text-white bg-pink-700 rounded hover:bg-pink-600">Instagram →</a>
            </div>
            <div className="text-end mt-6">
            </div>
          </div>
           <div className="md:shrink-0">
            <img className=" w-full object-cover md:h-full md:w-48" src={rayen}/>
          </div>
        </div>
      </div>
    </>
  )
}
