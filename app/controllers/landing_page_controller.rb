class LandingPageController < ApplicationController
  def index
    @partersData = [{name:'AWS',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/datawhale.png'},
                    {name:'Datawhale',num:'20',url:'partners/datawhale.png'},
                    {name:'Datawhale',num:'20',url:'partners/datawhale.png'}]
    @newsData = [{url:'partners/datawhale.png',text:'By using natural language to achieve the integration and utilization of hybrid cloud resources, natural language processing technology can simplify workflows, reduce IT infrastructure costs, and improve collaboration efficiency between teams.'},
                 {url:'partners/aws.png',text:'By using natural language to achieve the integration and utilization of hybrid cloud resources, natural language processing technology can simplify workflows, reduce IT infrastructure costs, and improve collaboration efficiency between teams.'},
                 {url:'partners/nvidia.png',text:'By using natural language to achieve the integration and utilization of hybrid cloud resources, natural language processing technology can simplify workflows, reduce IT infrastructure costs, and improve collaboration efficiency between teams.'}]
  end
end