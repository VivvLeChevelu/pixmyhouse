<?php 

namespace App\Menu;

use Knp\Menu\FactoryInterface;

class Builder
{
    private $factory;
    private $tokenStorage;

    public function __construct(FactoryInterface $factory, $tokenStorage = null)
    {
        $this->factory = $factory;
        $this->tokenStorage = $tokenStorage;
    }

    public function createAdminMenu()
    {   
        $menu = $this->factory->createItem('root');
        return $menu;
    }

    public function createMainMenu()
    {
        $menu = $this->factory->createItem('root');
        return $menu;
    }
    
    public function createUserMenu()
    {
        $user = $this->tokenStorage->getToken()->getUser();
        $menu = $this->factory->createItem('root');

        if (is_object($user)) {
            $parent = $menu
            ->addChild($user->getUsername(), ['uri' => '#'])
            ->setExtra('translation_domain', false)
            ;
            $parent->addChild('logout', ['route' => 'fos_user_security_logout']);
        } else { // Pas connecté
            $menu->addChild('login', ['route' => 'fos_user_security_login']);
        } 
        return $menu;
    }

    public function createAdministrateurMenu()
    {
        $user = $this->tokenStorage->getToken()->getUser();
        $menu = $this->factory->createItem('root');

        if (is_object($user)) {
            if( $user->getRoles()[0] == "ROLE_SUPER_ADMIN"){
            $parent = $menu
            ->addChild('ADMINISTRATION', ['uri' => '#'])
            ->setExtra('translation_domain', false) ; 
            $parent->addChild('Users', ['route' => 'user_index']);          
            $parent->addChild('Oeuvres', ['route' => 'admin_oeuvre_index']);  
            $parent->addChild('Commandes', ['route' => 'commande_index']);  
        }
    }
        return $menu;
    }
}