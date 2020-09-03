import { exporter } from '@/utils/exporter'
import SampleOne from '@/components/sample/SampleOne'
import SampleTwo from '@/components/sample/SampleTwo'

exporter({
  name: 'sample-fragment',
  components: {
    'sample-one': SampleOne,
    'sample-two': SampleTwo,
  },
  //plugins: [],
})
