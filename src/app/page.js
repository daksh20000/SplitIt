import Image from "next/image";
import { ArrowRight} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import HeroImage from "../../public/hero.png"
import { FEATURES, STEPS, TESTIMONIALS } from "@/lib/landing";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar,  AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";


export default function Home() {

  return (
    <div className="flex flex-col pt-16 " variant="secondary" size="icon" >
      <section className="mt-20 pb-12 space-y-10 md:space-y-20 px-5"> 
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge variant={"outline"} className="bg-green-100 text-green-700">
            Split Expenses. Simplify Life.
          </Badge>
          <h1 className=" gradient-title mx-auto max-w-4xl font-bold text-4xl md:text-7xl ">
            The Smartest way to split expenses with Friends.
          </h1>
          <p className="mx-auto max-w-2xl text-gray-500 md:text-xl/relaxed">
            Track shared expenses, split bills effortlessly, and settle upquickly. Never worry about who owes who again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button size={"lg"} asChild className="bg-green-600 hover:bg-green-700 transition">
              <Link href={"/dashboard"} >
                Get Started <ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
            </Button>
            <Button variant= {"outline"} size={"lg"} asChild className="border-green-600 text-green-600 hover:bg-green-100 transition">
              <Link href={"#how-it-works"} >
                See How It Works
              </Link>
            </Button>
          </div>
        </div>
        <div className="container mx-auto max-w-5xl ">
          <div className=" p-1 gradient max-w-fit rounded-xl mx-auto ">
            <Image
            src={HeroImage}
            width={720}
            height={1280}
            alt="Banner"
            className="rounded-lg mx-auto"
            priority  
            />
          </div>
        </div>
      </section>
      <section id="features" className="bg-gray-50 py-20 ">
        <div className="container mx-auto text-center px-4 md:px-6">
          <Badge variant={"outline"} className="bg-green-100 text-green-700">
            Features
          </Badge>
          <h2 className=" gradient-title  mt-4 text-3xl  md:text-4xl ">
            Everything you need to split expenses.
          </h2>
          <p className="mx-auto  mt-3 max-w-2xl text-gray-500 md:text-xl/relaxed">
            Our platform provide all the tools you need to handle shared expenses with ease.
          </p>
          <div className=" mx-auto  mt-10 max-w-7xl flex flex-col flex-wrap  sm:flex-row gap-4 items-center p-10 space-y-4">
            {FEATURES?.map(({title, Icon, bg, color, description})=>{
              return(
                <Card key={title} className=" mx-auto flex flex-col items-center space-y-4 p-6 text-center sm:h-80 h-80 sm:w-90 w-60 ">
                  <div className={`rounded-full p-3 ${bg}  mx-auto`}>
                    <Icon className={`h-6 w-6 ${color}`}/>
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-gray-500">{description}</p>

                </Card>
              )
            })}
          </div>
        </div>
      </section>
      <section id="how-it-works" className=" py-20 ">
        <div className="container mx-auto text-center px-4 md:px-6">
          <Badge variant={"outline"} className="bg-green-100 text-green-700">
            How It Works
          </Badge>
          <h2 className=" gradient-title  mt-4 text-3xl  md:text-4xl ">
            Splitting expenses has never been easier.
          </h2>
          <p className="mx-auto  mt-3 max-w-2xl text-gray-500 md:text-xl/relaxed">
            Follow these simple steps to start tracking and splitting expenses with friends.
          </p>
          <div className="mx-auto  mt-10 max-w-6xl flex flex-col sm:flex-row items-center justify-center flex-wrap gap-4 p-10 ">
            {STEPS.map(({description,label,title})=>{
              return(
                <div key={description} className="flex flex-col justify-center items-center gap-6  h-70 sm:h-60 w-60 sm:w-80 px-4 py-6 rounded-lg">
                  <div className="rounded-full h-12 w-12 text-green-600 font-bold text-xl bg-green-200 flex items-center justify-center ">{label}</div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-center text-gray-500">{description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section  className="bg-gray-50 py-20 ">
        <div className="container mx-auto text-center px-4 md:px-6">
          <Badge variant={"outline"} className="bg-green-100 text-green-700">
            Testimonials
          </Badge>
          <h2 className=" gradient-title  mt-4 text-3xl  md:text-4xl ">
            What are users are saying
          </h2>
          <div className="mx-auto  mt-5 max-w-6xl grid md:grid-cols-2 lg:grid-cols-3  gap-6 p-10 ">
            {TESTIMONIALS?.map(({image,name,quote,role,id})=>(
              <Card key={id}>
                <CardContent>
                  <p className="text-gray-600 text-left">{quote}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <Image 
                    src={image}
                    alt={name}
                    className="w-10 rounded-full"
                    width={500}
                    height={500}
                    priority/>
                    <div className="text-left">
                      <p className="text-sm font-medium " >{name}</p>
                      <p className="text-sm text-muted-foreground underline ">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 gradient">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Ready to simplify expense sharing?
          </h2>
          <p className="text-green-100 mx-auto max-w-[600px] md:text-xl/relaxed ">
            Join thousands of users who has made splitting expenses stress-free
          </p>
          <Button size={"lg"} asChild className="bg-green-800 hover:opacity-90 transition">
              <Link href={"/dashboard"} >
                Get Started <ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
