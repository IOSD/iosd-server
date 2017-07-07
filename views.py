from django.http import HttpResponse
from django.views.generic import View

from projectname.utils import render_to_pdf #created in step 4

class GeneratePdf(View):
     def get(self, request, *args, **kwargs):
        data = {
              'date': datetime.date.today(),
             'name': 'Cooper Maan',
             'ID': 1233434,
         }
        pdf = render_to_pdf('pdf/invoice.html', data)
        return HttpResponse(pdf, content_type='application/pdf')
