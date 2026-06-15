from django.db import models

# Create your models here.

class Employe(models.Model):
	matricule = models.CharField(max_length = 20, unique = True)
	nom = models.CharField(max_length = 50)
	prenom = models.CharField(max_length = 50)
	agence = models.CharField(max_length = 10)
	poste = models.CharField(max_length = 20)
	telephone = models.CharField(max_length = 20)

	def __str__(self):
		return f"{self.matricule} - {self.nom} {self.prenom}"