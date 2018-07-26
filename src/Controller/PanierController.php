<?php
namespace App\Controller;

use App\Entity\Oeuvre;
use App\Entity\Commande;
use App\Entity\DetailCommandes;
use App\Entity\User;
use App\Form\OeuvreType;
use App\Form\CommandeType;
use App\Repository\OeuvreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/panier")
 */
class PanierController extends Controller
{
    
    // /**
    //  * @Route("/", name="panier_index", methods="GET")
    //  */
    // public function index(OeuvreRepository $oeuvreRepository): Response
    // {
    //     return $this->render('boutique.html.twig', ['oeuvres' => $oeuvreRepository->findAll()]);
    // }


    /**
     * Ajout d'un article au panier
     * @Route("/ajout", name="panier_ajout", methods="GET")
     */
    public function ajout(Request $request, OeuvreRepository $oeuvreRepository): Response
    {
        // Sauvegarde des articles commandés: id et quantité
        $_SESSION['commande'][$_GET['id']] = $_GET['id'];
        $_SESSION['quantite'][$_GET['id']] = $_GET['qte'];
        $_SESSION['prix'][$_GET['id']] = $_GET['prix'];

        $listCommande = $_SESSION['commande'];
        return $this->render('oeuvre/boutique.html.twig', ['oeuvres' => $oeuvreRepository->findAll(),
                                                           'listCommande' => $listCommande]);
    }


    /**
     * @Route("/validerCommande", name="panier_validerCommande", methods="GET")
     */
    public function validerCommande(Request $request, OeuvreRepository $oeuvreRepository): Response
    {
        $oeuvres = $_SESSION['commande'];
        if($oeuvres != null){ // Test si il y aumoins un article !
            $em = $this->getDoctrine()->getManager();

            // Réupération de la liste des oeuvres: id, quantité, prix*qté        
            $oeuvres = $_SESSION['commande'];
            $quantites = $_SESSION['quantite'];
            $prix = $_SESSION['prix']; 

            // Recuperation du client
            $user = new User();
            $userId = ($this->get('security.token_storage')->getToken()->getUser())->getId();
            $user = $this->getDoctrine()->getRepository(User::class)->find($userId);

            // Calcul de la somme de la commande
            $montantTotal = 0;
            foreach ($oeuvres as $oeuvre){
                $montantTotal = $montantTotal + $prix[$oeuvre];
            }

            // Création de la commande
            $commande = new Commande();  
            $commande->setEtat('Nouvelle commande');  
            $commande->setMontant($montantTotal); 
            $commande->setUser($user); 
            $em->persist($commande);     
            $em->flush();

            // Creation des lignes de commandes
            
            foreach ($oeuvres  as $oeuvre) {
                $detailCommande = new DetailCommandes();
                $detailCommande->setQuantite($quantites[$oeuvre]);
                $detailCommande->setPrix($prix[$oeuvre]); 
                        // Recuperation de l'oeuvre
                        $oeuvrebdd = new Oeuvre();
                        $oeuvreId = $oeuvre;
                        $oeuvrebdd = $this->getDoctrine()->getRepository(Oeuvre::class)->find($oeuvreId);
                        $detailCommande->setOeuvres($oeuvrebdd);
                $detailCommande->setCommande($commande);
                $em->persist($detailCommande);
                $em->flush();   
            } 

            // Réinitialisation du panier     
            $_SESSION['commande'] = null;
            $_SESSION['quantite'] = null;

            // Retour à la boutique
            $listCommande = [] ;
            return $this->redirectToRoute('panier_commande_edit', ['id' => $commande->getId()]);
    }else{
        $listCommande = null;
        return $this->render('oeuvre/boutique.html.twig', ['oeuvres' => $oeuvreRepository->findAll(),
                                                           'listCommande' => $listCommande]);
    }
}


    /**
     * @Route("/{id}/edit", name="panier_commande_edit", methods="GET|POST")
     */
    public function edit(Request $request, Commande $commande): Response
    {
        $form = $this->createForm(CommandeType::class, $commande);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('panier_commande_edit', ['id' => $commande->getId()]);
        }
        return $this->render('panier/edit.html.twig', [
            'commande' => $commande
        ]);
    }
    /**
     * Vider le panier
     * @Route("/vider", name="panier_vider", methods="GET")
     */
    public function viderPanier(Request $request, OeuvreRepository $oeuvreRepository): Response
    {
        // Annulation de la commande: on réinitalise la liste des articles du panier
        $_SESSION['commande']=null;
        $_SESSION['quantite']=null;

        $listCommande = null;
        return $this->render('oeuvre/boutique.html.twig', ['oeuvres' => $oeuvreRepository->findAll(),
                                                           'listCommande' => $listCommande]);
    }


    
    /**
     * Voir le panier
     * @Route("/voir", name="panier_voir", methods="GET")
     */
    public function voirPanier(Request $request, OeuvreRepository $oeuvreRepository): Response
    {
        $listOeuvresPanier = [];
        $listQuantités = $_SESSION['quantite'];
        $listCommande = [];

        $em = $this->getDoctrine()->getManager();  

        
        $oeuvres = $_SESSION['commande'];
        if($oeuvres != null){
        foreach ($oeuvres  as $oeuvre) {
                    $oeuvreId = $oeuvre;
                    $oeuvrebdd = $this->getDoctrine()->getRepository(Oeuvre::class)->find($oeuvreId);
                    array_push($listOeuvresPanier , $oeuvrebdd);
        } 

        return $this->render('panier/previsualisation.html.twig', [ 'listOeuvresPanier' => $listOeuvresPanier,
        'listQuantités' => $listQuantités ]);
        }else{
            $listCommande = null;
            return $this->render('oeuvre/boutique.html.twig', ['oeuvres' => $oeuvreRepository->findAll(),
                                                               'listCommande' => $listCommande]);
        }
    }
    
}

