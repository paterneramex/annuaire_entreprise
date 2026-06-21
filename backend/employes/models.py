from django.db import models
from django.core.validators import RegexValidator


class EmployeQuerySet(models.QuerySet):
    """Custom QuerySet to override bulk delete with soft delete"""
    def delete(self):
        """Soft delete all objects in the queryset instead of hard delete.
        Example: Employe.objects.filter(agence="SAVA").delete()"""
        return self.update(is_active=False)


class EmployeActiveManager(models.Manager):
    """Manager that only returns active employees by default"""
    def get_queryset(self):
        return EmployeQuerySet(self.model, using=self._db).filter(is_active=True)
    #self.model = class Employe(models.Model) down


class Employe(models.Model):
    matricule = models.CharField(max_length=50, primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    poste = models.CharField(max_length=100)
    agence = models.CharField(max_length=100)
    telephone = models.CharField(
        max_length=25,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?[1-9]\d{1,14}$',
                message="Numéro de téléphone invalide. Exemples valides: +261341234567, +33612345678, +1234567890"
            )
        ]
    )
    is_active = models.BooleanField(default=True)

    # Managers
    objects = EmployeActiveManager()      # Default: only active employees
    all_objects = models.Manager()        # Access all employees (including inactive)

    def __str__(self):
        return f"{self.prenom} {self.nom}"

    def delete(self, *args, **kwargs):
        """Soft delete individual object"""
        self.is_active = False
        self.save(update_fields=['is_active'])

    def restore(self):
        """Restore a soft-deleted employee"""
        self.is_active = True
        self.save(update_fields=['is_active'])

    def hard_delete(self, *args, **kwargs):
        """Permanently delete from database"""
        super().delete(*args, **kwargs)